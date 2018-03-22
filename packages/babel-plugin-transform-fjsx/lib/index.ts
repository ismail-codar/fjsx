import * as t from "@babel/types";
import { NodePath } from "babel-traverse";
import { fComputeParametersInExpression } from "./parameters";
// import generate from "@babel/generator";

export = function() {
  return {
    visitor: {
      MemberExpression(path: NodePath<t.MemberExpression>, file) {
        if (
          t.isIdentifier(path.node.object) &&
          path.node.object.name === "React"
        ) {
          path.node.object.name = "fjsx";
        }
      },
      JSXExpressionContainer(path: NodePath<t.JSXExpressionContainer>, file) {
        // const code = generate(path.node).code;
        if (t.isJSXAttribute(path.container))
          if (
            t.isObjectExpression(path.node.expression) &&
            path.container.name.name.toString() === "style"
          )
            //style-member-access, style-conditional
            setupStyleAttributeExpression(path.node.expression);
          else
            path.node.expression = attributeExpression(
              path.container.name.name.toString(),
              path.node.expression
            );
        else if (
          t.isMemberExpression(path.node.expression) ||
          t.isBinaryExpression(path.node.expression)
        ) {
          if (t.isJSXElement(path.parent)) {
            path.node.expression = attributeExpression(
              "textContent",
              path.node.expression
            );
          }
        } else if (t.isConditionalExpression(path.node.expression)) {
          //element-text-conditional
          path.node.expression = appendReplaceConditionallyExpression(
            path.node.expression
          );
        } else if (
          t.isCallExpression(path.node.expression) &&
          t.isMemberExpression(path.node.expression.callee) &&
          path.node.expression.callee.property.name == "map" &&
          path.node.expression.callee.object["property"].name == "$val"
        ) {
          //array-map
          path.node.expression = arrayMapExpression(path.node.expression);
        }
      }
    }
  };
};

const setupStyleAttributeExpression = (expression: t.ObjectExpression) => {
  expression.properties.forEach((prop: t.ObjectProperty) => {
    if (!t.isLiteral(prop.value)) {
      prop.value = attributeExpression(
        "style." + prop.key.name,
        prop.value as t.Expression
      );
    }
  });
};

const arrayMapExpression = (expression: t.CallExpression) => {
  const arrayName = [];
  let callMember = expression.callee["object"].object;
  while (true) {
    if (t.isIdentifier(callMember)) {
      arrayName.push(callMember.name);
      break;
    } else {
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
          returnStatement.argument
        );
      }
    } else if (t.isConditionalExpression(returnStatement)) {
      returnFn.body = appendReplaceConditionallyExpression(
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

const attributeExpression = (
  attributeName: string,
  expression: t.Expression
) => {
  const fComputeParameters = [];
  fComputeParametersInExpression(expression, fComputeParameters);
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

const appendReplaceConditionallyExpression = (expression: t.Expression) => {
  const fComputeParameters = [];
  fComputeParametersInExpression(expression, fComputeParameters);
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
