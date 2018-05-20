import * as babylon from "babylon";
import traverse from "@babel/traverse";
import { NodePath, Scope } from "babel-traverse";
import * as t from "@babel/types";
import { check, checker } from "./check";
import { modify } from "./modify";
import { parameters } from "./parameters";
import { found } from "./found";
import { modifyDom } from "./modify-dom";
import generate from "@babel/generator";
import { realpathSync } from "fs";
import { join } from "path";
import { exportRegistry } from "./export-registry";
import { allSvgElements, htmlAndSvgElements } from "./svg";

var micromatch = require("micromatch");

const errorReport = (e: Error, path: NodePath<any>, file) => {
  const nodeCode = generate(path.node).code;
  console.log("FILE: ", file.filename);
  console.log("PART: ", nodeCode);
  console.error("ERROR: ", e);
  debugger;
};

function getRealpath(n) {
  try {
    return realpathSync(n) || n;
  } catch (e) {
    return n;
  }
}

var doNotTraverse = false;
const openedTags: string[] = [];

export = function() {
  return {
    visitor: {
      Program: {
        enter(path) {
          if (!this.opts) return;
          doNotTraverse = false;
          try {
            if (
              (this.opts.include &&
                micromatch(this.file.opts.filename, this.opts.include, {
                  matchBase: true
                }).length === 0) ||
              (this.opts.exclude &&
                micromatch(this.file.opts.filename, this.opts.exclude, {
                  matchBase: true
                }).length)
            ) {
              doNotTraverse = true;
            }
            if (this.opts.checkFn) {
              var checkerFunctions = require(join(
                this.file.opts.cwd,
                this.opts.checkFn
              ));
              if (checkerFunctions)
                for (var key in checkerFunctions) {
                  checker[key] = checkerFunctions[key];
                }
            }
          } catch (e) {
            errorReport(e, path, this.file);
          }
        }
      },
      // Identifier(path: NodePath<t.Identifier>, file) {
      //   console.log(path.node.name);
      //   // if (path.scope.parent.bindings[path.node.name]) {
      //   //   path.scope.parent.bindings[path.node.name].path.parent
      //   //     .leadingComments;
      //   // }
      //   if (check.isTrackedVariable(path.scope, path.node)) {
      // path.node.left  = modify.memberVal(expression.right);    vs...
      //   }
      // }
      MemberExpression(path: NodePath<t.MemberExpression>, file) {
        if (doNotTraverse) return;
        try {
          if (
            t.isIdentifier(path.node.object) &&
            path.node.object.name === "React"
          ) {
            path.node.object.name = "fjsx";
          }
          if (
            (t.isMemberExpression(path.parent) &&
              path.parent.property.name === "$val") == false &&
            check.isTrackedKey(path.scope, path.node) &&
            t.isIdentifier(path.node.object)
          ) {
            //track-item-keys-1
            path.node.object = t.memberExpression(
              path.node.object,
              t.identifier(path.node.property.name)
            );
            path.node.property = t.identifier("$val");
          } else if (
            check.specialMemberAccessKeywords.indexOf(
              path.node.property.name
            ) === -1 &&
            check.isTrackedVariable(path.scope, path.node.object)
          ) {
            path.node.object = modify.memberVal(path.node.object);
          } else if (
            t.isMemberExpression(path.node.property) &&
            t.isCallExpression(path.parentPath.node) === false &&
            t.isVariableDeclarator(path.parentPath.node) === false &&
            check.isTrackedByNodeName(path.node.property) &&
            (t.isMemberExpression(path.parentPath.node) &&
              path.parentPath.node.property.name === "$val") == false
          ) {
            //object-indexed-property-1
            path.node.property = t.memberExpression(
              path.node.property,
              t.identifier("$val")
            );
          }
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      VariableDeclarator(path: NodePath<t.VariableDeclarator>, file) {
        if (doNotTraverse) return;
        try {
          if (
            t.isVariableDeclaration(path.parent) &&
            (check.isTrackedByNodeName(path.node) ||
              check.hasTrackedComment(path))
          ) {
            if (path.node.init && check.isDynamicExpression(path.node.init)) {
              const fComputeParameters = parameters.fjsxComputeParametersInExpressionWithScopeFilter(
                path.scope,
                path.node.init
              );
              if (fComputeParameters.length > 0) {
                path.node.init = modify.dynamicExpressionInitComputeValues(
                  path.node.init,
                  fComputeParameters
                );
              } else if (
                //TODO reduce
                !check.hasTrackedSetComment(path) &&
                !check.isTrackedVariable(path.scope, path.node.init) &&
                !t.isCallExpression(path.node.init)
              )
                path.node.init = modify.fjsxValueInit(path.node.init);
            } else if (
              !check.hasTrackedSetComment(path) &&
              !check.isTrackedVariable(path.scope, path.node.init) &&
              !t.isCallExpression(path.node.init) //freezed-1
            )
              path.node.init = modify.fjsxValueInit(path.node.init);
          }
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      ObjectProperty(path: NodePath<t.ObjectProperty>, file) {
        if (doNotTraverse) return;
        try {
          const leftIsTracked =
            check.isTrackedByNodeName(path.node.key) ||
            check.isTrackedVariable(path.scope, path.node);
          const rightIsTracked = check.isTrackedVariable(
            path.scope,
            path.node.value
          );
          if (rightIsTracked) {
            if (!leftIsTracked) {
              path.node.value = modify.memberVal(path.node.value);
            }
          } else if (leftIsTracked) {
            const rightIsDynamic = check.isDynamicExpression(path.node.value);
            if (rightIsDynamic) {
              const fComputeParameters = parameters.fjsxComputeParametersInExpressionWithScopeFilter(
                path.scope,
                path.node.value
              );
              if (fComputeParameters.length > 0) {
                path.node.value = modify.dynamicExpressionInitComputeValues(
                  path.node.value,
                  fComputeParameters
                );
              } else if (!check.isFjsxCall(path.node.value))
                path.node.value = modify.fjsxValueInit(path.node.value);
            } else if (!check.isFjsxCall(path.node.value))
              path.node.value = modify.fjsxValueInit(path.node.value);
          }
          /*
          const isComponent = check.objectPropertyParentIsComponent(path);
          if (
            check.isTrackedByNodeName(path.node.key) &&
            isComponent &&
            check.isDynamicExpression(path.node.value) //component-3
          ) {
            const fComputeParameters = parameters.fjsxComputeParametersInExpressionWithScopeFilter(
              path.scope,
              path.node.value
            );
            if (fComputeParameters.length > 0) {
              path.node.value = modify.dynamicExpressionInitComputeValues(
                path.node.value,
                fComputeParameters
              );
            }
          } else {
            if (
              !isComponent &&
              check.isTrackedVariable(path.scope, path.node.value)
            ) {
              //class-names
              path.node.value = modify.memberVal(path.node.value);
            } else if (
              (check.isTrackedByNodeName(path.node.key) ||
                check.isTrackedVariable(path.scope, path.node)) &&
              !check.isFjsxCall(path.node.value) &&
              !check.isTrackedVariable(path.scope, path.node.value)
            ) {
              //object-property-1
              path.node.value = modify.fjsxValueInit(path.node.value as any);
            } else {
              //ts-interface-1
              const parentVariablePath = found.parentPathFound(
                path,
                checkPath => t.isVariableDeclarator(checkPath.node)
              );
              if (
                parentVariablePath &&
                t.isIdentifier(path.node.key) &&
                check.hasTrackedKeyComment(
                  parentVariablePath.parent.leadingComments,
                  path.node.key.name
                )
              ) {
                path.node.value = modify.fjsxValueInit(path.node.value);
              } else {
                const parentCallPath: NodePath<
                  t.CallExpression
                > = found.parentPathFound(path, checkPath =>
                  t.isCallExpression(checkPath.node)
                );
                // list.$val.push
                if (
                  parentCallPath &&
                  t.isMemberExpression(parentCallPath.node.callee) &&
                  t.isMemberExpression(parentCallPath.node.callee.object) &&
                  parentCallPath.node.callee.object.property.name === "$val"
                )
                  path.node.value = modify.fjsxValueInit(path.node.value);
              }
            }
          }
          */
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      LogicalExpression(path: NodePath<t.LogicalExpression>, file) {
        if (doNotTraverse) return;
        try {
          modify.pathNodeLeftRight(path);
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      BinaryExpression(path: NodePath<t.BinaryExpression>, file) {
        if (doNotTraverse) return;
        try {
          modify.pathNodeLeftRight(path);
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      CallExpression(path: NodePath<t.CallExpression>, file) {
        if (doNotTraverse) return;
        try {
          if (
            t.isMemberExpression(path.node.callee) &&
            path.node.callee.property.name == "createElement" &&
            t.isIdentifier(path.node.callee.object) &&
            (path.node.callee.object.name === "React" ||
              check.isFjsxName(path.node.callee.object.name))
          ) {
            const firstArgument = path.node.arguments[0];
            const secondArgument: any =
              path.node.arguments.length > 1 ? path.node.arguments[1] : null;
            if (t.isStringLiteral(firstArgument)) {
              if (
                t.isStringLiteral(firstArgument) &&
                check.isSvgElementTagName(firstArgument.value, openedTags)
              )
                path.node.callee.property.name = "createSvgElement";
            }

            let jsxFactoryName = null;
            if (t.isIdentifier(firstArgument)) {
              let variableBinding = found.variableBindingInScope(
                path.scope,
                firstArgument.name
              );
              if (
                variableBinding &&
                t.isImportDeclaration(variableBinding.path.parent)
              ) {
                const importPath = variableBinding.path.parent.source.value;
                if (
                  this.opts.exclude &&
                  micromatch(importPath + ".", this.opts.exclude, {
                    matchBase: true
                  }).length
                ) {
                  jsxFactoryName = importPath.substr(
                    importPath.lastIndexOf(".") + 1
                  );
                }
              }
            }
            if (jsxFactoryName === null) {
              const elementFactoryPropIndex =
                secondArgument && secondArgument.properties
                  ? secondArgument.properties.findIndex(
                      item => item.key.name === "elementFactory"
                    )
                  : -1;
              if (elementFactoryPropIndex !== -1) {
                //integration-1
                jsxFactoryName =
                  secondArgument.properties[elementFactoryPropIndex].value
                    .value;
                secondArgument.properties.splice(elementFactoryPropIndex, 1);
              }
            }
            if (jsxFactoryName !== null) {
              path.node.callee.property.name =
                "createElementBy" +
                jsxFactoryName[0].toUpperCase() +
                jsxFactoryName.substr(1);
            }
          }
          const member = found.callExpressionFirstMember(path.node);
          if (member && member.name && !check.isFjsxName(member.name)) {
            const contextArgumentIndex = found.findContextChildIndex(
              path.node.arguments
            );
            if (contextArgumentIndex !== -1) {
              modify.moveContextArguments(
                path.node.arguments,
                contextArgumentIndex
              );
            } else if (!member.name.startsWith("React")) {
              const methodParams = found.callingMethodParams(
                path,
                file.filename
              );
              if (
                !methodParams ||
                path.node.arguments.length !== methodParams.length
              ) {
                // debugger;
                // throw "callingMethodParams is not found";
              }
              path.node.arguments.forEach((argument, index) => {
                const leftIsTracked = check.isTrackedVariable(
                  path.scope,
                  argument
                );
                const rightIsTracked =
                  methodParams &&
                  check.isTrackedVariable(path.scope, methodParams[index]);
                if (rightIsTracked) {
                  if (!leftIsTracked) {
                    //call-2 call-3
                    path.node.arguments[index] = modify.fjsxValueInit(
                      path.node.arguments[index]
                    );
                  }
                } else {
                  if (leftIsTracked) {
                    path.node.arguments[index] = modify.memberVal(
                      path.node.arguments[index]
                    );
                  }
                }
              });
            }
          }
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      ConditionalExpression(path: NodePath<t.ConditionalExpression>, file) {
        if (doNotTraverse) return;
        try {
          if (check.isTrackedVariable(path.scope, path.node.consequent)) {
            path.node.consequent = modify.memberVal(path.node.consequent);
          }
          if (check.isTrackedVariable(path.scope, path.node.alternate)) {
            path.node.consequent = modify.memberVal(path.node.alternate);
          }
          if (check.isTrackedVariable(path.scope, path.node.test)) {
            path.node.test = modify.memberVal(path.node.test);
          }
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>, file) {
        if (doNotTraverse) return;
        try {
          // if (t.isAssignmentExpression(path.node.body)) {
          //   path.node.body = modify.fjsxCall(
          //     path.node.body.left,
          //     path.node.body.right,
          //     "="
          //   );
          // }
          modify.expressionStatementGeneralProcess("body", path);
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      ExpressionStatement(path: NodePath<t.ExpressionStatement>, file) {
        if (doNotTraverse) return;
        try {
          modify.expressionStatementGeneralProcess("expression", path);
        } catch (e) {
          errorReport(e, path, file);
        }
      },
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>, file) {
        openedTags.push(path.node.name["name"]);
      },
      JSXClosingElement(path: NodePath<t.JSXClosingElement>, file) {
        openedTags.pop();
      },
      JSXExpressionContainer(path: NodePath<t.JSXExpressionContainer>, file) {
        if (doNotTraverse) return;
        try {
          if (
            t.isCallExpression(path.node.expression) === false && //class-names-4 vs component-1
            check.expressionContainerParentIsComponent(path)
          )
            return;
          if (t.isJSXAttribute(path.container))
            if (
              t.isObjectExpression(path.node.expression) &&
              path.container.name.name.toString() === "style"
            )
              //style-member-access, style-conditional
              modifyDom.setupStyleAttributeExpression(
                path.scope,
                path.node.expression
              );
            else {
              if (
                t.isCallExpression(path.node.expression) &&
                check.isTrackedByNodeName(path.container.name) &&
                check.objectPropertyParentIsComponent(path)
              ) {
                //class-names-6
                const fComputeParameters = parameters.fjsxComputeParametersInExpressionWithScopeFilter(
                  path.scope,
                  path.node.expression
                );
                if (fComputeParameters.length)
                  path.node.expression = modify.dynamicExpressionInitComputeValues(
                    path.node.expression,
                    fComputeParameters
                  );
                else
                  path.node.expression = modify.fjsxValueInit(
                    path.node.expression
                  );
              } else {
                path.node.expression = modifyDom.attributeExpression(
                  path.scope,
                  path.container.name.name.toString(),
                  path.node.expression,
                  check.isSvgElementTagName(
                    found.pathElementTagName(path),
                    openedTags
                  )
                );
              }
            }
          else if (
            check.isValMemberProperty(path.node.expression) ||
            check.isTrackedVariable(path.scope, path.node.expression) ||
            t.isMemberExpression(path.node.expression) ||
            t.isBinaryExpression(path.node.expression) ||
            (t.isCallExpression(path.node.expression) &&
              !check.isArrayMapExpression(path.scope, path.node.expression))
          ) {
            if (t.isJSXElement(path.parent) || t.isJSXFragment(path.parent)) {
              path.node.expression = modifyDom.attributeExpression(
                path.scope,
                "textContent",
                path.node.expression,
                false
              );
            }
          } else if (t.isConditionalExpression(path.node.expression)) {
            //element-text-conditional
            path.node.expression = modifyDom.appendReplaceConditionallyExpression(
              path.scope,
              path.node.expression
            );
          } else if (
            t.isCallExpression(path.node.expression) &&
            check.isArrayMapExpression(path.scope, path.node.expression)
          ) {
            //array-map
            path.node.expression = modifyDom.arrayMapExpression(
              path.scope,
              path.node.expression
            );
          }
        } catch (e) {
          errorReport(e, path, file);
        }
      }
    }
  };
};
