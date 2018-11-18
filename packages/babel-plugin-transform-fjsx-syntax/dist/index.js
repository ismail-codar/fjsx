"use strict";
const t = require("@babel/types");
const check_1 = require("./check");
const modify_1 = require("./modify");
const parameters_1 = require("./parameters");
const found_1 = require("./found");
const modify_dom_1 = require("./modify-dom");
const generator_1 = require("@babel/generator");
const fs_1 = require("fs");
const path_1 = require("path");
var micromatch = require('micromatch');
const errorReport = (e, path, file) => {
    const nodeCode = generator_1.default(path.node).code;
    console.log('FILE: ', file.filename);
    console.log('PART: ', nodeCode);
    console.error('ERROR: ', e);
    debugger;
};
function getRealpath(n) {
    try {
        return fs_1.realpathSync(n) || n;
    }
    catch (e) {
        return n;
    }
}
var doNotTraverse = false;
const openedTags = [];
module.exports = function () {
    return {
        visitor: {
            Program: {
                enter(path) {
                    if (!this.opts)
                        return;
                    doNotTraverse = false;
                    try {
                        if ((this.opts.include &&
                            micromatch(this.file.opts.filename, this.opts.include, {
                                matchBase: true
                            }).length === 0) ||
                            (this.opts.exclude &&
                                micromatch(this.file.opts.filename, this.opts.exclude, {
                                    matchBase: true
                                }).length)) {
                            doNotTraverse = true;
                        }
                        if (this.opts.checkFn) {
                            var checkerFunctions = require(path_1.join(this.file.opts.cwd, this.opts.checkFn));
                            if (checkerFunctions)
                                for (var key in checkerFunctions) {
                                    check_1.checker[key] = checkerFunctions[key];
                                }
                        }
                    }
                    catch (e) {
                        errorReport(e, path, this.file);
                    }
                }
            },
            MemberExpression(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    if (t.isIdentifier(path.node.object) && path.node.object.name === 'React') {
                        path.node.object.name = 'fjsx';
                    }
                    if ((t.isMemberExpression(path.parent) && path.parent.property.name === '$val') == false &&
                        check_1.check.isTrackedKey(path.scope, path.node) &&
                        t.isIdentifier(path.node.object)) {
                        //track-item-keys-1
                        path.node.object = t.memberExpression(path.node.object, t.identifier(path.node.property.name));
                        path.node.property = t.identifier('$val');
                    }
                    else if (check_1.check.specialMemberAccessKeywords.indexOf(path.node.property.name) === -1 &&
                        check_1.check.isTrackedVariable(path.scope, path.node.object)) {
                        path.node.object = modify_1.modify.memberVal(path.node.object);
                    }
                    else if (t.isMemberExpression(path.node.property) &&
                        t.isCallExpression(path.parentPath.node) === false &&
                        t.isVariableDeclarator(path.parentPath.node) === false &&
                        check_1.check.isTrackedByNodeName(path.node.property) &&
                        (t.isMemberExpression(path.parentPath.node) && path.parentPath.node.property.name === '$val') ==
                            false) {
                        //object-indexed-property-1
                        path.node.property = t.memberExpression(path.node.property, t.identifier('$val'));
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            VariableDeclarator(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    if (t.isVariableDeclaration(path.parent) &&
                        (check_1.check.isTrackedByNodeName(path.node) || check_1.check.hasTrackedComment(path))) {
                        if (path.node.init && check_1.check.isDynamicExpression(path.node.init)) {
                            const fComputeParameters = parameters_1.parameters.fjsxComputeParametersInExpressionWithScopeFilter(path.scope, path.node.init);
                            if (fComputeParameters.length > 0) {
                                path.node.init = modify_1.modify.dynamicExpressionInitComputeValues(path.node.init, fComputeParameters);
                            }
                            else if (
                            //TODO reduce
                            !check_1.check.hasTrackedSetComment(path) &&
                                !check_1.check.isTrackedVariable(path.scope, path.node.init) &&
                                !t.isCallExpression(path.node.init))
                                path.node.init = modify_1.modify.fjsxValueInit(path.node.init);
                        }
                        else if (!check_1.check.hasTrackedSetComment(path) &&
                            !check_1.check.isTrackedVariable(path.scope, path.node.init) &&
                            !t.isCallExpression(path.node.init) //freezed-1
                        )
                            path.node.init = modify_1.modify.fjsxValueInit(path.node.init);
                    }
                    else if (check_1.check.isTrackedVariable(path.scope, path.node.init) ||
                        check_1.check.isTrackedVariable(path.scope, path.node.id) // variable-init-1
                    ) {
                        path.node.init = modify_1.modify.memberVal(path.node.init);
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            ObjectProperty(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    const leftIsTracked = check_1.check.isTrackedByNodeName(path.node.key) || check_1.check.isTrackedVariable(path.scope, path.node);
                    const rightIsTracked = check_1.check.isTrackedVariable(path.scope, path.node.value);
                    if (rightIsTracked) {
                        if (!leftIsTracked) {
                            path.node.value = modify_1.modify.memberVal(path.node.value);
                        }
                    }
                    else if (leftIsTracked) {
                        const rightIsDynamic = check_1.check.isDynamicExpression(path.node.value);
                        if (rightIsDynamic) {
                            const fComputeParameters = parameters_1.parameters.fjsxComputeParametersInExpressionWithScopeFilter(path.scope, path.node.value);
                            if (fComputeParameters.length > 0) {
                                path.node.value = modify_1.modify.dynamicExpressionInitComputeValues(path.node.value, fComputeParameters);
                            }
                            else if (!check_1.check.isFjsxCall(path.node.value))
                                path.node.value = modify_1.modify.fjsxValueInit(path.node.value);
                        }
                        else if (!check_1.check.isFjsxCall(path.node.value) && !check_1.check.isFjsxElementFunction(path.node.value))
                            path.node.value = modify_1.modify.fjsxValueInit(path.node.value);
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            LogicalExpression(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    modify_1.modify.pathNodeLeftRight(path);
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            BinaryExpression(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    modify_1.modify.pathNodeLeftRight(path);
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            CallExpression(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    if (t.isMemberExpression(path.node.callee) &&
                        path.node.callee.property.name == 'createElement' &&
                        t.isIdentifier(path.node.callee.object) &&
                        (path.node.callee.object.name === 'React' || check_1.check.isFjsxName(path.node.callee.object.name))) {
                        const firstArgument = path.node.arguments[0];
                        const secondArgument = path.node.arguments.length > 1 ? path.node.arguments[1] : null;
                        if (t.isStringLiteral(firstArgument)) {
                            if (t.isStringLiteral(firstArgument) &&
                                check_1.check.isSvgElementTagName(firstArgument.value, openedTags))
                                path.node.callee.property.name = 'createSvgElement';
                        }
                        let jsxFactoryName = null;
                        if (t.isIdentifier(firstArgument)) {
                            let variableBinding = found_1.found.variableBindingInScope(path.scope, firstArgument.name);
                            if (variableBinding && t.isImportDeclaration(variableBinding.path.parent)) {
                                const importPath = variableBinding.path.parent.source.value;
                                if (this.opts.exclude &&
                                    micromatch(importPath + '.', this.opts.exclude, {
                                        matchBase: true
                                    }).length) {
                                    jsxFactoryName = importPath.substr(importPath.lastIndexOf('.') + 1);
                                }
                            }
                        }
                        if (jsxFactoryName === null) {
                            const elementFactoryPropIndex = secondArgument && secondArgument.properties
                                ? secondArgument.properties.findIndex((item) => item.key.name === 'elementFactory')
                                : -1;
                            if (elementFactoryPropIndex !== -1) {
                                //integration-1
                                jsxFactoryName = secondArgument.properties[elementFactoryPropIndex].value.value;
                                secondArgument.properties.splice(elementFactoryPropIndex, 1);
                            }
                        }
                        if (jsxFactoryName !== null) {
                            path.node.callee.property.name =
                                'createElementBy' + jsxFactoryName[0].toUpperCase() + jsxFactoryName.substr(1);
                        }
                    }
                    const member = found_1.found.callExpressionFirstMember(path.node);
                    if (member && member.name && !check_1.check.isFjsxName(member.name)) {
                        const contextArgumentIndex = found_1.found.findContextChildIndex(path.node.arguments);
                        if (contextArgumentIndex !== -1) {
                            modify_1.modify.moveContextArguments(path.node.arguments, contextArgumentIndex);
                        }
                        else if (!member.name.startsWith('React')) {
                            const methodParams = found_1.found.callingMethodParams(path, file.filename);
                            if (!methodParams || path.node.arguments.length !== methodParams.length) {
                                // debugger;
                                // throw "callingMethodParams is not found";
                            }
                            path.node.arguments.forEach((argument, index) => {
                                const leftIsTracked = check_1.check.isTrackedVariable(path.scope, argument);
                                const rightIsTracked = methodParams && check_1.check.isTrackedVariable(path.scope, methodParams[index]);
                                if (rightIsTracked) {
                                    if (!leftIsTracked) {
                                        //call-2 call-3
                                        path.node.arguments[index] = modify_1.modify.fjsxValueInit(path.node.arguments[index]);
                                    }
                                }
                                else {
                                    if (leftIsTracked) {
                                        path.node.arguments[index] = modify_1.modify.memberVal(path.node.arguments[index]);
                                    }
                                }
                            });
                        }
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            ConditionalExpression(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    if (check_1.check.isTrackedVariable(path.scope, path.node.consequent)) {
                        path.node.consequent = modify_1.modify.memberVal(path.node.consequent);
                    }
                    if (check_1.check.isTrackedVariable(path.scope, path.node.alternate)) {
                        path.node.alternate = modify_1.modify.memberVal(path.node.alternate);
                    }
                    if (check_1.check.isTrackedVariable(path.scope, path.node.test)) {
                        path.node.test = modify_1.modify.memberVal(path.node.test);
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            ArrowFunctionExpression(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    // if (t.isAssignmentExpression(path.node.body)) {
                    //   path.node.body = modify.fjsxCall(
                    //     path.node.body.left,
                    //     path.node.body.right,
                    //     "="
                    //   );
                    // }
                    modify_1.modify.expressionStatementGeneralProcess('body', path);
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            IfStatement(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    if (t.isIdentifier(path.node.test) && check_1.check.isTrackedVariable(path.scope, path.node.test)) {
                        //if-1
                        path.node.test = modify_1.modify.memberVal(path.node.test);
                    }
                    else if (t.isMemberExpression(path.node.test) &&
                        check_1.check.isTrackedVariable(path.scope, path.node.test.property)) {
                        //if-2
                        path.node.test = modify_1.modify.memberVal(path.node.test);
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            ExpressionStatement(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    modify_1.modify.expressionStatementGeneralProcess('expression', path);
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            },
            JSXOpeningElement(path, file) {
                openedTags.push(path.node.name['name']);
            },
            JSXClosingElement(path, file) {
                openedTags.pop();
            },
            JSXExpressionContainer(path, file) {
                if (doNotTraverse)
                    return;
                try {
                    if (t.isCallExpression(path.node.expression) === false && //class-names-4 vs component-1
                        check_1.check.expressionContainerParentIsComponent(path))
                        return;
                    if (t.isJSXAttribute(path.container))
                        if (t.isObjectExpression(path.node.expression) &&
                            path.container.name.name.toString() === 'style')
                            //style-member-access, style-conditional
                            modify_dom_1.modifyDom.setupStyleAttributeExpression(path.scope, path.node.expression);
                        else {
                            const componentPropertyIsTracked = check_1.check.isTrackedByNodeName(path.container.name) &&
                                check_1.check.objectPropertyParentIsComponent(path);
                            if (t.isCallExpression(path.node.expression) && componentPropertyIsTracked) {
                                //class-names-6
                                const fComputeParameters = parameters_1.parameters.fjsxComputeParametersInExpressionWithScopeFilter(path.scope, path.node.expression);
                                if (fComputeParameters.length)
                                    path.node.expression = modify_1.modify.dynamicExpressionInitComputeValues(path.node.expression, fComputeParameters);
                                else
                                    path.node.expression = modify_1.modify.fjsxValueInit(path.node.expression);
                            }
                            else if (!componentPropertyIsTracked) {
                                path.node.expression = modify_dom_1.modifyDom.attributeExpression(path.scope, path.container.name.name.toString(), path.node.expression, check_1.check.isSvgElementTagName(found_1.found.pathElementTagName(path), openedTags));
                            }
                        }
                    else if (check_1.check.isValMemberProperty(path.node.expression) ||
                        check_1.check.isTrackedVariable(path.scope, path.node.expression) ||
                        t.isMemberExpression(path.node.expression) ||
                        t.isBinaryExpression(path.node.expression) ||
                        (t.isCallExpression(path.node.expression) &&
                            !check_1.check.isArrayMapExpression(path.scope, path.node.expression))) {
                        if (t.isJSXElement(path.parent) || t.isJSXFragment(path.parent)) {
                            path.node.expression = modify_dom_1.modifyDom.attributeExpression(path.scope, 'textContent', path.node.expression, false);
                        }
                    }
                    else if (t.isConditionalExpression(path.node.expression)) {
                        //element-text-conditional
                        path.node.expression = modify_dom_1.modifyDom.appendReplaceConditionallyExpression(path.scope, path.node.expression);
                    }
                    else if (t.isCallExpression(path.node.expression) &&
                        check_1.check.isArrayMapExpression(path.scope, path.node.expression)) {
                        //array-map
                        path.node.expression = modify_dom_1.modifyDom.arrayMapExpression(path.scope, path.node.expression);
                    }
                }
                catch (e) {
                    errorReport(e, path, file);
                }
            }
        }
    };
};
//# sourceMappingURL=index.js.map