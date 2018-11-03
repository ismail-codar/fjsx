"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("@babel/types");
const check_1 = require("./check");
const parameters_1 = require("./parameters");
const fjsxValueInit = (init) => {
    return t.callExpression(t.memberExpression(t.identifier("fjsx"), t.identifier(t.isArrayExpression(init) ? "array" : "value")), [init == null ? t.nullLiteral() : init]);
};
const fjsxCall = (left, right, operator) => {
    if (operator === "=")
        return t.callExpression(left, [right]);
    else {
        operator = operator.substr(0, 1);
        return t.callExpression(left, [
            t.binaryExpression(operator, left, right)
        ]);
    }
};
const assignmentExpressionToCallCompute = (expression, fComputeParameters) => {
    if (t.isMemberExpression(expression.left) &&
        t.isIdentifier(expression.left.object) &&
        expression.left.property.name === "$val")
        return t.callExpression(t.memberExpression(t.identifier("fjsx"), t.identifier("compute")), [
            t.functionExpression(t.identifier(""), [], t.blockStatement([
                t.expressionStatement(t.callExpression(expression.left.object, [expression.right]))
            ]))
        ].concat(fComputeParameters));
};
const dynamicExpressionInitComputeValues = (expression, fComputeParameters) => {
    return t.callExpression(t.memberExpression(t.identifier("fjsx"), t.identifier("initCompute")), [
        t.functionExpression(t.identifier(""), [], t.blockStatement([t.returnStatement(expression)]))
    ].concat(fComputeParameters));
};
const fjsxAssignmentExpressionSetCompute = (expression, fComputeParameters) => {
    const leftName = t.isIdentifier(expression.left)
        ? expression.left.name
        : "TODO";
    return t.callExpression(t.memberExpression(t.identifier("fjsx"), t.identifier("setCompute")), [
        t.identifier(leftName),
        t.functionExpression(t.identifier(""), [], t.blockStatement([t.returnStatement(expression.right)]))
    ].concat(fComputeParameters));
};
const expressionStatementGeneralProcess = (propertyName, path) => {
    const expression = path.node[propertyName];
    if (t.isAssignmentExpression(expression)) {
        // const code = generate(path.node).code;
        if (t.isMemberExpression(expression.left)) {
            const rightIsFjsxCall = check_1.check.isFjsxCall(expression.right);
            if (rightIsFjsxCall)
                return;
            const leftIsTracked = check_1.check.isTrackedVariable(path.scope, expression.left);
            const rightIsTracked = check_1.check.isTrackedVariable(path.scope, expression.right);
            if (rightIsTracked) {
                if (leftIsTracked) {
                    path.node[propertyName] = exports.modify.fjsxCall(expression.left, expression.right, expression.operator);
                }
            }
            else {
                if (leftIsTracked) {
                    path.node[propertyName] = exports.modify.fjsxCall(expression.left, expression.right, expression.operator);
                }
            }
        }
        if (check_1.check.hasTrackedSetComment(path)) {
            if (!(t.isIdentifier(expression.right) &&
                check_1.check.isTrackedVariable(path.scope, expression.right)) // @tracked != @tracked ...
            ) {
                const fComputeParameters = parameters_1.parameters.fjsxComputeParametersInExpressionWithScopeFilter(path.scope, expression.right);
                expression.right = exports.modify.fjsxAssignmentExpressionSetCompute(expression, fComputeParameters);
            }
        }
        else if (check_1.check.isTrackedVariable(path.scope, expression.left)) {
            path.node[propertyName] = exports.modify.fjsxCall(expression.left, expression.right, expression.operator);
        }
        else if (check_1.check.isTrackedVariable(path.scope, expression.right) &&
            !check_1.check.isExportsMember(expression.left)) {
            expression.right = exports.modify.memberVal(expression.right);
        }
    }
    else if (t.isUpdateExpression(expression)) {
        if (check_1.check.isTrackedVariable(path.scope, expression.argument)) {
            path.node[propertyName] = exports.modify.fjsxCall(expression.argument, t.numericLiteral(1), expression.operator);
        }
    }
};
const memberVal = (expression) => {
    if (t.isUnaryExpression(expression)) {
        expression.argument = t.memberExpression(expression.argument, t.identifier("$val"));
        return expression;
    }
    else
        return t.memberExpression(expression, t.identifier("$val"));
};
exports.moveContextArguments = (args, contextArgIndex) => {
    const contextArgProps = args[contextArgIndex].arguments[1].properties;
    const contextArgs = args[contextArgIndex].arguments.splice(2);
    contextArgs.push(t.callExpression(t.memberExpression(t.identifier("fjsx"), t.identifier("endContext")), [contextArgProps[0].value]));
    args[contextArgIndex] = t.callExpression(t.memberExpression(t.identifier("fjsx"), t.identifier("startContext")), [contextArgProps[0].value, contextArgProps[1].value]);
    args.splice.apply(args, [contextArgIndex + 1, 0].concat(contextArgs));
};
exports.pathNodeLeftRight = (path) => {
    if (t.isIdentifier(path.node.left)) {
        if (check_1.check.isTrackedVariable(path.scope, path.node.left)) {
            path.node.left = exports.modify.memberVal(path.node.left);
        }
    }
    else if (t.isMemberExpression(path.node.left)) {
        if (check_1.check.isTrackedVariable(path.scope, path.node.left)) {
            path.node.left = exports.modify.memberVal(path.node.left);
        }
    }
    if (t.isIdentifier(path.node.right)) {
        if (check_1.check.isTrackedVariable(path.scope, path.node.right)) {
            path.node.right = exports.modify.memberVal(path.node.right);
        }
    }
    else if (t.isMemberExpression(path.node.right)) {
        if (check_1.check.isTrackedVariable(path.scope, path.node.right)) {
            path.node.right = exports.modify.memberVal(path.node.right);
        }
    }
};
exports.modify = {
    fjsxValueInit,
    fjsxCall,
    memberVal,
    dynamicExpressionInitComputeValues,
    assignmentExpressionToCallCompute,
    fjsxAssignmentExpressionSetCompute,
    expressionStatementGeneralProcess,
    moveContextArguments: exports.moveContextArguments,
    pathNodeLeftRight: exports.pathNodeLeftRight
};
//# sourceMappingURL=modify.js.map