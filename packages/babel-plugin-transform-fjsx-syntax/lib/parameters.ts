import * as t from "@babel/types";
import { check } from "./check";
import { Scope } from "babel-traverse";

//üstteki fCompute fonksiyonların parametrelerinde de varmı kontrolü yap... Örn: array-map-conditional
const listIncludes = (list: t.Expression[], item: t.Expression) => {
  return (
    list.find(listItem => {
      const itemName = item["property"] ? item["property"].name : item["name"];
      const listItemName = listItem["property"]
        ? listItem["property"].name
        : listItem["name"];
      return listItemName == itemName;
    }) != undefined
  );
};

export const fjsxComputeParametersInExpression = (
  expression: t.Expression,
  list: t.Expression[]
): void => {
  if (t.isIdentifier(expression)) {
    if (!listIncludes(list, expression)) list.push(expression);
  }
  if (t.isMemberExpression(expression)) {
    if (t.isMemberExpression(expression.object))
      fjsxComputeParametersInExpression(expression.object, list);
    if (t.isIdentifier(expression.property)) {
      if (expression.property.name === "$val") {
        const objectValue = expression.object as t.MemberExpression;
        if (!listIncludes(list, objectValue)) list.push(objectValue);
      } else if (check.isTrackedByNodeName(expression.property)) {
        const objectValue = expression as t.MemberExpression;
        if (!listIncludes(list, objectValue))
          list.push(
            t.memberExpression(objectValue.object, objectValue.property)
          );
      }
    }
  } else if (t.isBinaryExpression(expression))
    checkBinaryExpression(expression, list);
  else if (t.isConditionalExpression(expression))
    checkConditionalExpression(expression, list);
  else if (t.isCallExpression(expression))
    checkExpressionList(expression.arguments, list);
  else if (t.isObjectExpression(expression))
    checkExpressionList(expression.properties, list);
};

const checkConditionalExpression = (
  expression: t.ConditionalExpression,
  list: t.Expression[]
) => {
  fjsxComputeParametersInExpression(expression.test, list);
  if (t.isExpression(expression.consequent))
    fjsxComputeParametersInExpression(expression.consequent, list);
  if (t.isExpression(expression.alternate))
    fjsxComputeParametersInExpression(expression.alternate, list);
};

const checkBinaryExpression = (
  expression: t.BinaryExpression,
  list: t.Expression[]
) => {
  fjsxComputeParametersInExpression(expression.left, list);
  fjsxComputeParametersInExpression(expression.right, list);
};

const checkExpressionList = (
  argumentList: Array<
    | t.Expression
    | t.SpreadElement
    | t.JSXNamespacedName
    | t.ObjectMethod
    | t.ObjectProperty
  >,
  list: t.Expression[]
) => {
  argumentList.forEach(arg => {
    if (t.isExpression(arg))
      fjsxComputeParametersInExpression(arg as t.Expression, list);
    else if (t.isObjectProperty(arg))
      fjsxComputeParametersInExpression(arg.value as t.Expression, list);
    else throw "not implemented argument type in checkExpressionList";
  });
};

export const fjsxComputeParametersInExpressionWithScopeFilter = (
  scope: Scope,
  expression: t.Expression
) => {
  const fComputeParameters = [];
  fjsxComputeParametersInExpression(expression, fComputeParameters);
  return fComputeParameters.filter(item =>
    check.isTrackedVariable(scope, item)
  );
};

export const parameters = {
  fjsxComputeParametersInExpression,
  fjsxComputeParametersInExpressionWithScopeFilter
};

/**
const checkXExpression = (
  expression: t.XExpression,
  list: t.MemberExpression[]
) => {
    fjsxComputeParametersInExpression
};
 */
