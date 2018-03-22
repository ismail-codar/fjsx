import { format } from "prettier";

var assert = require("assert");
var babel = require("@babel/core");
var chalk = require("chalk");
var clear = require("clear");
var diff = require("diff");
var fs = require("fs");
var path = require("path");
import "better-log/install";

require("@babel/register");

var pluginPath = require.resolve("../lib");

function runTests() {
  var testsPath = __dirname + "/fixtures/";

  let testList = fs
    .readdirSync(testsPath)
    .map(function(item) {
      return {
        path: path.join(testsPath, item),
        name: item
      };
    })
    .filter(function(item) {
      return fs.statSync(item.path).isDirectory();
    });

  // testList = [
  //   {
  //     path:
  //       "/Users/macbook/DEV/bulutcrm/bulutcrm-repo/app-packages/babel-plugin-transform-fjsx/test/fixtures/variable-binary-2",
  //     name: "test"
  //   }
  // ];
  return testList.map(runTest).reduce((acc, cur) => acc + cur, 0);
}

function runTest(dir) {
  if (dir.name.startsWith("_")) {
    return;
  }
  var exitCode = 0;
  var output = babel.transformFileSync(dir.path + "/actual.jsx", {
    plugins: [pluginPath]
  });

  var expected = fs.readFileSync(dir.path + "/expected.js", "utf-8");

  process.stdout.write(chalk.bgWhite.black(dir.name));
  process.stdout.write("\n");

  function normalizeLines(str: string) {
    str = format(str, {
      parser: "babylon"
    }).replace(`"use strict";`, "");
    return str.trim().replace(/\r\n/g, "\n");
  }

  const formattedOutput = normalizeLines(output.code);
  const formattedExpected = normalizeLines(expected);
  if (formattedOutput == formattedExpected) {
    process.stdout.write("√");
  } else {
    const diffParts = diff.diffLines(formattedOutput, formattedExpected);

    if (diffParts.length == 1) process.stdout.write("√");
    else
      diffParts.forEach(function(part) {
        var value = part.value;
        if (part.added) {
          value = chalk.green(value);
          exitCode = 1;
        } else if (part.removed) {
          value = chalk.red(value);
          exitCode = 1;
        }
        process.stdout.write(value);
      });
  }

  process.stdout.write("\n");

  return exitCode;
}

if (process.argv.indexOf("--watch") >= 0) {
  require("watch").watchTree(__dirname + "/..", function() {
    delete require.cache[pluginPath];
    clear();
    console.log("Press Ctrl+C to stop watching...");
    console.log("================================");
    try {
      runTests();
    } catch (e) {
      console.error(chalk.magenta(e.stack));
    }
  });
} else {
  var exitCode = runTests();
  process.exit(exitCode);
}
