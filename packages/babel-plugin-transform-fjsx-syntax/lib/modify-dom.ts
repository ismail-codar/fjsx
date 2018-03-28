import * as t from "@babel/types";
import { parameters } from "./parameters";
import { Scope } from "babel-traverse";

const attributeExpression = (
  scope: Scope,
  attributeName: string,
  expression: t.Expression
) => {
  const fComputeParameters = parameters.fjsxComputeParametersInExpressionWithScopeFilter(
    scope,
    expression
  );
  if (fComputeParameters.length == 0) return expression;
  // console.log(fComputeParameters.map(parameter => generate(parameter).code));

  const statements: t.ExpressionStatement[] = [];
  if (attributeName === "textContent") {
    statements.push(
      t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.identifier("element"),
          t.callExpression(
            t.memberExpression(
              t.identifier("fjsx"),
              t.identifier("createTextNode")
            ),
            [t.identifier("element")]
          )
        )
      )
    );
  }
  statements.push(
    t.expressionStatement(
      t.callExpression(
        t.identifier("fjsx.compute"),
        [
          t.functionExpression(
            t.identifier(""),
            [],
            t.blockStatement([
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.memberExpression(
                    t.identifier("element"),
                    t.identifier(attributeName)
                  ),
                  expression
                )
              )
            ])
          )
        ].concat(fComputeParameters)
      )
    )
  );

  return t.functionExpression(
    t.identifier(""),
    [t.identifier("element")],
    t.blockStatement(statements)
  );
};

const setupStyleAttributeExpression = (
  scope: Scope,
  expression: t.ObjectExpression
) => {
  expression.properties.forEach((prop: t.ObjectProperty) => {
    if (!t.isLiteral(prop.value)) {
      prop.value = attributeExpression(
        scope,
        "style." + prop.key.name,
        prop.value as t.Expression
      );
    }
  });
};

const appendReplaceConditionallyExpression = (
  scope: Scope,
  expression: t.Expression
) => {
  const fComputeParameters = parameters.fjsxComputeParametersInExpressionWithScopeFilter(
    scope,
    expression
  );
  if (fComputeParameters.length == 0) return expression;
  return t.functionExpression(
    t.identifier(""),
    [t.identifier("element")],
    t.blockStatement([
      t.variableDeclaration("let", [
        t.variableDeclarator(t.identifier("oldElement"))
      ]),
      t.expressionStatement(
        t.callExpression(
          t.identifier("fjsx.compute"),
          [
            t.functionExpression(
              t.identifier(""),
              [],
              t.blockStatement([
                t.expressionStatement(
                  t.assignmentExpression(
                    "=",
                    t.identifier("oldElement"),
                    t.callExpression(t.identifier("fjsx.conditionalElement"), [
                      t.identifier("element"),
                      t.identifier("oldElement"),
                      expression
                    ])
                  )
                )
              ])
            )
          ].concat(fComputeParameters)
        )
      )
    ])
  );
};

const arrayMapExpression = (scope: Scope, expression: t.CallExpression) => {
  const arrayName = [];
  let callMember = expression.callee["object"];
  while (true) {
    if (t.isIdentifier(callMember)) {
      arrayName.push(callMember.name);
      break;
    } else {
      if (callMember.property.name !== "$val")
        arrayName.push(callMember.property.name);
      callMember = callMember.object as t.MemberExpression;
    }
  }
  let returnStatement: t.ReturnStatement | t.JSXElement = null;
  const returnFn = expression.arguments[0];

  if (
    t.isArrowFunctionExpression(returnFn) ||
    t.isFunctionExpression(returnFn)
  ) {
    if (t.isBlockStatement(returnFn.body)) {
      returnStatement = returnFn.body.body[
        returnFn.body.body.length - 1
      ] as t.ReturnStatement;
      if (!t.isReturnStatement(returnStatement))
        throw "returnStatement must be last place in the block";
    } else if (t.isJSXElement(returnFn.body)) returnStatement = returnFn.body;

    if (returnStatement == null)
      throw "returnStatement cannot be found in arrayMapExpression";

    if (t.isReturnStatement(returnStatement)) {
      if (t.isConditionalExpression(returnStatement.argument)) {
        returnStatement.argument = appendReplaceConditionallyExpression(
          scope,
          returnStatement.argument
        );
      }
    } else if (t.isConditionalExpression(returnStatement)) {
      returnFn.body = appendReplaceConditionallyExpression(
        scope,
        returnFn.body as t.Expression
      );
    }
  }

  return t.functionExpression(
    t.identifier(""),
    [t.identifier("element")],
    t.blockStatement([
      t.expressionStatement(
        t.callExpression(t.identifier("fjsx.arrayMap"), [
          t.identifier(arrayName.reverse().join(".")),
          t.identifier("element"),
          expression.arguments[0]
        ])
      )
    ])
  );
};

export const modifyDom = {
  attributeExpression,
  setupStyleAttributeExpression,
  appendReplaceConditionallyExpression,
  arrayMapExpression
};
