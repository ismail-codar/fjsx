"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("@babel/types");
//üstteki fCompute fonksiyonların parametrelerinde de varmı kontrolü yap... Örn: array-map-conditional
const listIncludes = (list, item) => {
    return (list.find(listItem => {
        const itemName = item["property"] ? item["property"].name : item["name"];
        const listItemName = listItem["property"]
            ? listItem["property"].name
            : listItem["name"];
        return listItemName == itemName;
    }) != undefined);
};
exports.fComputeParametersInExpression = (expression, list) => {
    if (t.isMemberExpression(expression)) {
        if (t.isMemberExpression(expression.object))
            exports.fComputeParametersInExpression(expression.object, list);
        if (t.isIdentifier(expression.property) &&
            expression.property.name === "$val") {
            const objectValue = expression.object;
            if (!listIncludes(list, objectValue))
                list.push(objectValue);
        }
    }
    else if (t.isBinaryExpression(expression))
        checkBinaryExpression(expression, list);
    else if (t.isConditionalExpression(expression))
        checkConditionalExpression(expression, list);
    else if (t.isCallExpression(expression))
        checkExpressionList(expression.arguments, list);
    else if (t.isObjectExpression(expression))
        checkExpressionList(expression.properties, list);
};
const checkConditionalExpression = (expression, list) => {
    exports.fComputeParametersInExpression(expression.test, list);
    if (t.isExpression(expression.consequent))
        exports.fComputeParametersInExpression(expression.consequent, list);
    if (t.isExpression(expression.alternate))
        exports.fComputeParametersInExpression(expression.alternate, list);
};
const checkBinaryExpression = (expression, list) => {
    exports.fComputeParametersInExpression(expression.left, list);
    exports.fComputeParametersInExpression(expression.right, list);
};
const checkExpressionList = (argumentList, list) => {
    argumentList.forEach(arg => {
        if (t.isExpression(arg))
            exports.fComputeParametersInExpression(arg, list);
        else if (t.isObjectProperty(arg))
            exports.fComputeParametersInExpression(arg.value, list);
        else
            throw "not implemented argument type in checkCallExpressionArguments";
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
//# sourceMappingURL=parameters.js.map