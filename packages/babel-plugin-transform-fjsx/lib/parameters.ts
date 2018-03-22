import * as t from "@babel/types";

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

export const fComputeParametersInExpression = (
  expression: t.Expression,
  list: t.MemberExpression[]
): void => {
  if (t.isMemberExpression(expression)) {
    if (t.isMemberExpression(expression.object))
      fComputeParametersInExpression(expression.object, list);
    if (
      t.isIdentifier(expression.property) &&
      expression.property.name === "$val"
    ) {
      const objectValue = expression.object as t.MemberExpression;
      if (!listIncludes(list, objectValue)) list.push(objectValue);
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
  list: t.MemberExpression[]
) => {
  fComputeParametersInExpression(expression.test, list);
  if (t.isExpression(expression.consequent))
    fComputeParametersInExpression(expression.consequent, list);
  if (t.isExpression(expression.alternate))
    fComputeParametersInExpression(expression.alternate, list);
};

const checkBinaryExpression = (
  expression: t.BinaryExpression,
  list: t.MemberExpression[]
) => {
  fComputeParametersInExpression(expression.left, list);
  fComputeParametersInExpression(expression.right, list);
};

const checkExpressionList = (
  argumentList: Array<
    | t.Expression
    | t.SpreadElement
    | t.JSXNamespacedName
    | t.ObjectMethod
    | t.ObjectProperty
  >,
  list: t.MemberExpression[]
) => {
  argumentList.forEach(arg => {
    if (t.isExpression(arg))
      fComputeParametersInExpression(arg as t.Expression, list);
    else if (t.isObjectProperty(arg))
      fComputeParametersInExpression(arg.value as t.Expression, list);
    else throw "not implemented argument type in checkCallExpressionArguments";
  });
};

/**
const checkXExpression = (
  expression: t.XExpression,
  list: t.MemberExpression[]
) => {
    fComputeParametersInExpression
};
 */
