import * as babylon from "babylon";
import traverse from "@babel/traverse";
import { NodePath, Scope } from "babel-traverse";
import * as t from "@babel/types";
import { check } from "./check";

const fjsxValueInit = (
  init: t.Expression | t.PatternLike | t.SpreadElement | t.JSXNamespacedName
) => {
  return t.callExpression(
    t.memberExpression(
      t.identifier("fjsx"),
      t.identifier(t.isArrayExpression(init) ? "array" : "value")
    ),
    [init == null ? t.nullLiteral() : (init as any)]
  );
};

const fjsxCall = (
  left: t.Expression | t.RestElement | t.LVal,
  right: t.Expression
) => {
  return t.callExpression(left as any, [right]);
};

const assignmentExpressionToCallCompute = (
  expression: t.AssignmentExpression,
  fComputeParameters: any[]
) => {
  if (
    t.isMemberExpression(expression.left) &&
    t.isIdentifier(expression.left.object) &&
    expression.left.property.name == "$val"
  )
    return t.callExpression(
      t.memberExpression(t.identifier("fjsx"), t.identifier("compute")),
      [
        t.functionExpression(
          t.identifier(""),
          [],
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(expression.left.object, [expression.right])
            )
          ])
        )
      ].concat(fComputeParameters)
    );
};

const binaryExpressionInitComputeValues = (
  expression: t.Expression,
  fComputeParameters: any[]
) => {
  return t.callExpression(
    t.memberExpression(t.identifier("fjsx"), t.identifier("initCompute")),
    [
      t.functionExpression(
        t.identifier(""),
        [],
        t.blockStatement([t.returnStatement(expression)])
      )
    ].concat(fComputeParameters)
  );
};

const fjsxAssignmentExpressionSetCompute = (
  expression: t.AssignmentExpression,
  fComputeParameters: any[]
) => {
  const leftName = t.isIdentifier(expression.left)
    ? expression.left.name
    : "TODO";
  return t.callExpression(
    t.memberExpression(t.identifier("fjsx"), t.identifier("setCompute")),
    [
      t.identifier(leftName),
      t.functionExpression(
        t.identifier(""),
        [],
        t.blockStatement([t.returnStatement(expression.right)])
      )
    ].concat(fComputeParameters)
  );
};

const memberVal = (
  expression:
    | t.Expression
    | t.SpreadElement
    | t.JSXNamespacedName
    | t.PatternLike
) => {
  if (t.isUnaryExpression(expression)) {
    expression.argument = t.memberExpression(
      expression.argument,
      t.identifier("$val")
    );
    return expression;
  } else return t.memberExpression(expression as any, t.identifier("$val"));
};

export const modify = {
  fjsxValueInit,
  fjsxCall,
  memberVal,
  binaryExpressionInitComputeValues,
  assignmentExpressionToCallCompute,
  fjsxAssignmentExpressionSetCompute
};
