"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("@babel/types");
const export_registry_1 = require("./export-registry");
const callExpressionFirstMember = (expression) => {
    if (t.isIdentifier(expression.callee))
        return expression.callee;
    else if (t.isMemberExpression(expression.callee)) {
        return memberExpressionFirstMember(expression.callee);
    }
};
const memberExpressionFirstMember = (expression) => {
    var member = expression;
    while (true) {
        if (t.isIdentifier(member.object))
            return member.object;
        else if (t.isMemberExpression(member.object))
            member = member.object;
        else if (t.isCallExpression(member.object))
            return callExpressionFirstMember(member.object);
        else if (t.isMemberExpression(member))
            return member.property;
    }
};
const parentPathFound = (path, check) => {
    while (path && !check(path))
        path = path.parentPath;
    return path;
};
const variableBindingInScope = (scope, searchName) => {
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
const callingMethodParamsInNode = (callee, node) => {
    var foundParams = [];
    if (t.isVariableDeclarator(node)) {
        if (t.isFunctionExpression(node.init)) {
            foundParams = node.init.params;
        }
        else if (t.isObjectExpression(node.init)) {
            //call-6
            if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
                node.init.properties.every(prop => {
                    if (t.isObjectProperty(prop) &&
                        t.isIdentifier(prop.key) &&
                        prop.key.name === callee.property.name &&
                        t.isFunctionExpression(prop.value)) {
                        foundParams = prop.value.params;
                        return false;
                    }
                    else
                        return true;
                });
            }
            else
                throw "not implemented in callingMethodParams";
        }
    }
    return foundParams;
};
const callingMethodParams = (path, filename) => {
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
                    foundParams = callingMethodParamsInNode(callee, variableBinding.path.node);
                    if (foundParams)
                        return true;
                }
                else if (t.isImportSpecifier(variableBinding.path.node)) {
                    const exportedNodes = export_registry_1.exportRegistry.loadImportedFileExports(filename, variableBinding.path.parent["source"].value);
                    exportedNodes.find(node => {
                        foundParams = callingMethodParamsInNode(callee, node);
                        return foundParams !== null;
                    });
                    if (foundParams)
                        return true;
                    return true;
                }
            }
        });
    }
    return foundParams;
};
const findContextChildIndex = (args) => {
    return args.findIndex(arg => {
        if (t.isCallExpression(arg) &&
            arg.arguments.length &&
            t.isMemberExpression(arg.arguments[0])) {
            const memberExpression = arg.arguments[0];
            if (t.isIdentifier(memberExpression.property) &&
                memberExpression.property.name == "Context") {
                return true;
            }
            else
                return false;
        }
        else
            return false;
    });
};
exports.pathElementTagName = (path) => {
    if (t.isJSXOpeningElement(path.parentPath.parentPath.node) &&
        t.isJSXIdentifier(path.parentPath.parentPath.node.name))
        return path.parentPath.parentPath.node.name.name;
    return null;
};
exports.found = {
    callExpressionFirstMember,
    memberExpressionFirstMember,
    parentPathFound,
    variableBindingInScope,
    callingMethodParams,
    findContextChildIndex,
    pathElementTagName: exports.pathElementTagName
};
//# sourceMappingURL=found.js.map