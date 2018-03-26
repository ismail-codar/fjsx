import * as babylon from "babylon";
import traverse from "@babel/traverse";
import { NodePath, Scope } from "babel-traverse";
import * as t from "@babel/types";
import { found } from "./found";

const COMMENT_TRACKED = "@tracked";
const COMMENT_NON_TRACKED = "@untracked";
const COMMENT_TRACK_KEYS = "@track_keys";

const specialMemberAccessKeywords = ["$val", "freezed"];

export const checker = {
  literalTracked: (name: string) => {
    return name.endsWith("$");
  },
  commentTracked: (text: string) => {
    return text.trim().startsWith(COMMENT_TRACKED);
  },
  commentTrackedSet: (text: string) => {
    return text.trim() === COMMENT_TRACKED + "_set";
  },
  commentHasTrackKeys: (text: string) => {
    return text.indexOf(COMMENT_TRACK_KEYS) !== -1;
  },
  commentHasTrackKey: (text: string, keyName: string) => {
    const str = text
      .substr(text.indexOf(COMMENT_TRACK_KEYS) + COMMENT_TRACK_KEYS.length + 1)
      .trim();
    return str.split("|").indexOf(keyName) !== -1;
  },
  commentNonTracked: (text: string) => {}
};

const isTrackedByNodeName = (node: t.BaseNode) => {
  if (t.isUnaryExpression(node)) node = node.argument;
  const nodeName = t.isIdentifier(node)
    ? node.name
    : t.isMemberExpression(node)
      ? node.property.name
      : t.isVariableDeclarator(node) && t.isIdentifier(node.id)
        ? node.id.name
        : null;
  return (
    nodeName &&
    checker.literalTracked(nodeName) &&
    specialMemberAccessKeywords.indexOf(nodeName) === -1
  );
};

const leadingCommentsFromPath = (path: NodePath<any>) => {
  let leadingComments = null;
  if (t.isProgram(path.parent)) {
    const searchName =
      t.isExpressionStatement(path.node) &&
      t.isAssignmentExpression(path.node.expression) &&
      t.isIdentifier(path.node.expression.left)
        ? path.node.expression.left.name
        : null;
    if (!searchName) return null;
    path.parent.body.every(item => {
      if (t.isVariableDeclaration(item)) {
        item.declarations.every(decl => {
          if (
            t.isVariableDeclarator(decl) &&
            t.isIdentifier(decl.id) &&
            decl.id.name == searchName
          ) {
            leadingComments = item.leadingComments;
          }
          return leadingComments == null;
        });
        return leadingComments == null;
      }
    });
  } else {
    if (path.isImportSpecifier(path.node)) {
      return path.parent.trailingComments;
    }
    leadingComments = path.parent.leadingComments;
    if (t.isExportNamedDeclaration(path.parentPath.parent))
      leadingComments = path.parentPath.parent.leadingComments;
  }
  return leadingComments;
};

const leadingCommentsHasTracked = (
  leadingComments: ReadonlyArray<t.Comment>
) => {
  if (leadingComments == null) return false;
  return (
    leadingComments.find(comment => checker.commentTracked(comment.value)) !=
    null
  );
};

const hasTrackedComment = (path: NodePath<any>) => {
  let leadingComments = leadingCommentsFromPath(path);
  return leadingCommentsHasTracked(leadingComments);
};

const hasTrackedSetComment = (path: NodePath<t.Node>) => {
  let leadingComments = leadingCommentsFromPath(path);
  if (leadingComments == null) return false;
  return (
    leadingComments.find(comment => checker.commentTrackedSet(comment.value)) !=
    null
  );
};

const hasTrackedKeyComment = (leadingComments: any[], keyName: string) => {
  if (!leadingComments) return false;
  const comment: t.Comment = leadingComments.find(item =>
    checker.commentHasTrackKeys(item.value)
  );
  if (!comment) return false;
  return checker.commentHasTrackKey(comment.value, keyName);
};

const isTrackedVariable = (
  scope: Scope,
  node:
    | t.Identifier
    | t.Expression
    | t.ObjectProperty
    | t.LVal
    | t.SpreadElement
    | t.JSXNamespacedName
) => {
  if (isTrackedByNodeName(node)) return true;
  if (leadingCommentsHasTracked(node.leadingComments)) {
    return true;
  }
  if (t.isMemberExpression(node) && t.isIdentifier(node.object)) {
    // var object1 = {
    //   // @tracked
    //   property1: 1
    // };
    let variableBinding = found.variableBindingInScope(scope, node.object.name);
    if (
      variableBinding &&
      t.isVariableDeclarator(variableBinding.path.node) &&
      t.isObjectExpression(variableBinding.path.node.init)
    ) {
      const property = variableBinding.path.node.init.properties.find(
        item => t.isObjectProperty(item) && item.key.name === node.property.name
      );
      if (property) return leadingCommentsHasTracked(property.leadingComments);
    }
  }

  let searchName = t.isIdentifier(node) ? node.name : null;
  let variableBinding =
    searchName && found.variableBindingInScope(scope, searchName);
  if (variableBinding) {
    if (
      t.isImportSpecifier(variableBinding.path.node) &&
      hasTrackedComment(variableBinding.path)
    ) {
      return true;
    } else if (
      t.isVariableDeclarator(variableBinding.path.node) &&
      t.isVariableDeclaration(variableBinding.path.parent) &&
      hasTrackedComment(variableBinding.path)
    ) {
      return true;
    }
  }
  return false;
};

const isTrackedKey = (scope: Scope, node: t.MemberExpression) => {
  const variableBinding = t.isIdentifier(node.object)
    ? found.variableBindingInScope(scope, node.object.name)
    : null;
  if (
    variableBinding &&
    hasTrackedKeyComment(
      variableBinding.path.node.leadingComments,
      node.property.name
    )
  )
    return true;
};

const fjsxValueBinaryInit = (
  // fjsx.value(a.$val + b.$val); gibi mi diye bak
  expression: t.Expression
): expression is t.CallExpression => {
  return (
    t.isCallExpression(expression) &&
    expression.arguments.length == 1 &&
    t.isBinaryExpression(expression.arguments[0]) &&
    t.isMemberExpression(expression.callee) &&
    t.isIdentifier(expression.callee.object) &&
    expression.callee.object.name == "fjsx" &&
    t.isIdentifier(expression.callee.property) &&
    expression.callee.property.name == "value"
  );
};

const parentPathComputeCallee = (path: NodePath<t.ExpressionStatement>) => {
  if (
    !path.parentPath ||
    !path.parentPath.parentPath ||
    !path.parentPath.parentPath.parentPath
  )
    return false;
  const parentPath = path.parentPath.parentPath.parentPath;
  if (
    t.isCallExpression(parentPath.node) &&
    t.isIdentifier(parentPath.node.callee)
  )
    return parentPath.node.callee.name === "fjsx.compute";
  else return false;
};

const expressionContainerParentIsComponent = (
  path: NodePath<t.JSXExpressionContainer>
) => {
  if (
    path.parentPath &&
    path.parentPath.parentPath &&
    t.isJSXOpeningElement(path.parentPath.parentPath.node) &&
    t.isJSXIdentifier(path.parentPath.parentPath.node.name)
  ) {
    const name = path.parentPath.parentPath.node.name.name;
    return name.substr(0, 1).toUpperCase() == name.substr(0, 1);
  }
};

const objectPropertyParentIsComponent = (path: NodePath<t.ObjectProperty>) => {
  if (
    Array.isArray(path.parentPath.container) &&
    path.parentPath.container.length &&
    t.isIdentifier(path.parentPath.container[0])
  ) {
    const name = path.parentPath.container[0]["name"];
    return name.substr(0, 1).toUpperCase() == name.substr(0, 1);
  }
};

export const isExportsMember = (expression: t.LVal) => {
  if (
    t.isMemberExpression(expression) &&
    t.isIdentifier(expression.object) &&
    expression.object.name === "exports"
  )
    return true;
};

export const isValMemberProperty = (node: t.BaseNode) => {
  return (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.property) &&
    node.property.name === "$val"
  );
};

export const check = {
  isValMemberProperty,
  isTrackedByNodeName,
  hasTrackedComment,
  hasTrackedSetComment,
  hasTrackedKeyComment,
  isTrackedVariable,
  isTrackedKey,
  specialMemberAccessKeywords,
  fjsxValueBinaryInit,
  parentPathComputeCallee,
  expressionContainerParentIsComponent,
  objectPropertyParentIsComponent,
  isExportsMember
};
