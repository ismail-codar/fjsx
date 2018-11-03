"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("@babel/types");
const check_1 = require("./check");
const generator_1 = require("@babel/generator");
const traverse_1 = require("@babel/traverse");
const found_1 = require("./found");
const listIncludes = (list, item) => {
    var itemCode = generator_1.default(item).code;
    if (itemCode.endsWith('.$val'))
        itemCode = itemCode.substr(0, itemCode.length - 5);
    return (list.find((listItem) => {
        var listItemCode = generator_1.default(listItem).code;
        if (listItemCode.endsWith('.$val'))
            listItemCode = listItemCode.substr(0, listItemCode.length - 5);
        return itemCode === listItemCode;
    }) != undefined);
};
const listAddWithControl = (scope, expression, list) => {
    if (check_1.check.isValMemberProperty(expression))
        list.push(expression.object);
    else if (check_1.check.isTrackedVariable(scope, expression))
        list.push(expression);
};
const fjsxComputeParametersInExpression = (scope, expression, list) => {
    if (t.isIdentifier(expression)) {
        if (!listIncludes(list, expression))
            listAddWithControl(scope, expression, list);
    }
    if (t.isMemberExpression(expression)) {
        if (t.isIdentifier(expression.property)) {
            if (expression.property.name === '$val') {
                const objectValue = expression;
                if (!listIncludes(list, objectValue))
                    listAddWithControl(scope, objectValue, list);
            }
            else if (check_1.check.isTrackedByNodeName(expression.property)) {
                const objectValue = expression;
                if (!listIncludes(list, objectValue))
                    listAddWithControl(scope, t.memberExpression(objectValue.object, objectValue.property), list);
            }
        }
        if (t.isIdentifier(expression.object)) {
            fjsxComputeParametersInExpression(scope, expression.object, list);
        }
    }
    else if (t.isBinaryExpression(expression))
        checkBinaryExpression(scope, expression, list);
    else if (t.isLogicalExpression(expression))
        checkLogicalExpression(scope, expression, list);
    else if (t.isConditionalExpression(expression))
        checkConditionalExpression(scope, expression, list);
    else if (t.isUnaryExpression(expression))
        fjsxComputeParametersInExpression(scope, expression.argument, list);
    else if (t.isCallExpression(expression)) {
        const methodName = t.isIdentifier(expression.callee) ? expression.callee.name : null;
        if (methodName) {
            let variableBinding = found_1.found.variableBindingInScope(scope, methodName);
            if (variableBinding) {
                if (t.isVariableDeclarator(variableBinding.path.node)) {
                    if (t.isFunctionExpression(variableBinding.path.node.init))
                        checkFunctionBody(expression.arguments, variableBinding.path.node.init.params, scope, variableBinding.path.node.init.body, list);
                    else
                        throw 'is not isFunctionExpression else ... not implemented ';
                }
                else if (t.isImportSpecifier(variableBinding.path.node)) {
                    // debugger;
                    // throw "not implemented imported callExpression";
                }
            }
        }
        checkExpressionList(scope, expression.arguments, list);
    }
    else if (t.isObjectExpression(expression))
        checkExpressionList(scope, expression.properties, list);
};
const checkFunctionBody = (args, params, scope, body, list) => {
    traverse_1.default(body, {
        MemberExpression(path, file) {
            if (!listIncludes(list, path.node)) {
                if (t.isIdentifier(path.node.object)) {
                    const searchName = path.node.object.name;
                    const argument = args[params.findIndex((p) => t.isIdentifier(p) && p.name == searchName)];
                    if (argument &&
                        t.isIdentifier(argument) &&
                        check_1.check.isTrackedVariable(scope, path.node.property)) {
                        list.push(t.memberExpression(argument, path.node.property));
                    }
                    else if (check_1.check.isTrackedVariable(scope, path.node.object)) {
                        const variableBinding = found_1.found.variableBindingInScope(scope, searchName);
                        // assuming that local variables cannot be found in passed scope
                        // if the variableBinding is found it is not local variable in this function
                        if (variableBinding) {
                            list.push(path.node.object);
                        }
                    }
                }
            }
        }
    }, scope);
};
const checkConditionalExpression = (scope, expression, list) => {
    fjsxComputeParametersInExpression(scope, expression.test, list);
    if (t.isExpression(expression.consequent))
        fjsxComputeParametersInExpression(scope, expression.consequent, list);
    if (t.isExpression(expression.alternate))
        fjsxComputeParametersInExpression(scope, expression.alternate, list);
};
const checkBinaryExpression = (scope, expression, list) => {
    fjsxComputeParametersInExpression(scope, expression.left, list);
    fjsxComputeParametersInExpression(scope, expression.right, list);
};
const checkLogicalExpression = (scope, expression, list) => {
    fjsxComputeParametersInExpression(scope, expression.left, list);
    fjsxComputeParametersInExpression(scope, expression.right, list);
};
const checkExpressionList = (scope, argumentList, list) => {
    argumentList.forEach((arg) => {
        if (t.isExpression(arg))
            fjsxComputeParametersInExpression(scope, arg, list);
        else if (t.isObjectProperty(arg))
            fjsxComputeParametersInExpression(scope, arg.value, list);
        else
            throw 'not implemented argument type in checkExpressionList';
    });
};
exports.fjsxComputeParametersInExpressionWithScopeFilter = (scope, expression) => {
    const fComputeParameters = [];
    fjsxComputeParametersInExpression(scope, expression, fComputeParameters);
    return fComputeParameters;
};
exports.parameters = {
    fjsxComputeParametersInExpressionWithScopeFilter: exports.fjsxComputeParametersInExpressionWithScopeFilter
};
//# sourceMappingURL=parameters.js.map