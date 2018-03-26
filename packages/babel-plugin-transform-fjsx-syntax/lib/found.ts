import * as t from "@babel/types";
import { NodePath, Scope, Binding } from "babel-traverse";

const callExpressionFirstMember = (
  expression: t.CallExpression
): t.Identifier => {
  if (t.isIdentifier(expression.callee)) return expression.callee;
  else if (t.isMemberExpression(expression.callee)) {
    let member = expression.callee;
    while (true) {
      if (t.isIdentifier(member.object)) return member.object;
      else if (t.isMemberExpression(member.object)) member = member.object;
      else if (t.isCallExpression(member.object))
        if (t.isIdentifier(member.object.callee)) return member.object.callee;
        else member = member.object.callee["object"];
      else {
        break;
        debugger;
      }
    }
  }
};

const parentPathFound = <T>(
  path: NodePath<any>,
  check: (path: NodePath<t.BaseNode>) => boolean
): NodePath<T> => {
  while (path && check(path) === false) path = path.parentPath;
  return path;
};

const variableBindingInScope = (scope: Scope, searchName: string): Binding => {
  while (scope != null && searchName) {
    for (var bindingKey in scope.bindings) {
      if (bindingKey == searchName) {
        return scope.bindings[bindingKey];
      }
    }
    scope = scope.parent;
  }
  return null;
};

const callingMethodParams = (path: NodePath<t.CallExpression>): t.LVal[] => {
  var foundParams = null;
  const callee = path.node.callee;
  const searchName = t.isIdentifier(callee)
    ? callee.name
    : t.isMemberExpression(callee) ? callee.property.name : null;
  if (searchName) {
    const foundPath = parentPathFound(path, checkPath => {
      const variableBinding = checkPath.scope.bindings[searchName];
      if (
        variableBinding &&
        t.isVariableDeclarator(variableBinding.path.node)
      ) {
        if (t.isFunctionExpression(variableBinding.path.node.init)) {
          foundParams = variableBinding.path.node.init.params;
          return true;
        }
      }
    });
  }
  return foundParams;
};

export const found = {
  callExpressionFirstMember,
  parentPathFound,
  variableBindingInScope,
  callingMethodParams
};
