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
  while (path && !check(path)) path = path.parentPath;
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

const callingMethodParams = (
  path: NodePath<t.CallExpression>,
  filename: string
): t.LVal[] => {
  var foundParams = null;
  const callee = path.node.callee;
  const searchName = t.isIdentifier(callee)
    ? callee.name
    : t.isMemberExpression(callee) && t.isIdentifier(callee.object)
      ? callee.object.name
      : null;
  if (searchName) {
    const foundPath = parentPathFound(path, checkPath => {
      const variableBinding = checkPath.scope.bindings[searchName];
      if (variableBinding) {
        if (t.isVariableDeclarator(variableBinding.path.node)) {
          if (t.isFunctionExpression(variableBinding.path.node.init)) {
            foundParams = variableBinding.path.node.init.params;
            return true;
          } else if (t.isObjectExpression(variableBinding.path.node.init)) {
            //call-6
            if (
              t.isMemberExpression(callee) &&
              t.isIdentifier(callee.property)
            ) {
              variableBinding.path.node.init.properties.every(prop => {
                if (
                  t.isObjectProperty(prop) &&
                  t.isIdentifier(prop.key) &&
                  prop.key.name === callee.property.name &&
                  t.isFunctionExpression(prop.value)
                ) {
                  foundParams = prop.value.params;
                  return true;
                }
              });
              if (foundParams) return true;
            } else throw "not implemented in callingMethodParams";
          }
        } else if (t.isImportSpecifier(variableBinding.path.node)) {
          //variableBinding.path.parent.source.value
          return true;
        }
      }
    });
  }
  return foundParams;
};

const findContextChildIndex = (args: any[]) => {
  return args.findIndex(arg => {
    if (
      t.isCallExpression(arg) &&
      arg.arguments.length &&
      t.isMemberExpression(arg.arguments[0])
    ) {
      const memberExpression = arg.arguments[0] as t.MemberExpression;
      if (
        t.isIdentifier(memberExpression.property) &&
        memberExpression.property.name == "Context"
      ) {
        return true;
      } else return false;
    } else return false;
  });
};

export const found = {
  callExpressionFirstMember,
  parentPathFound,
  variableBindingInScope,
  callingMethodParams,
  findContextChildIndex
};
