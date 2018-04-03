import { spawn } from "child_process";

const fs = require("fs");
const path = require("path");

const executeFileName = process.argv[2];
let executeCommand = "ts-node";
let executeArgs = [executeFileName];

console.error(executeFileName);

if (executeFileName.endsWith(".spec.ts")) {
  executeCommand = "node";
  executeArgs = ["./node_modules/jasmine-ts/lib/index.js", executeFileName];
} else if (executeFileName.endsWith(".demo.tsx")) {
  fs.writeFileSync(
    "./scripts/_demo.js",
    `module.exports = {
    view: require('${path
      .relative(__dirname, executeFileName)
      .replace(/\\/g, "/")}')
  };`
  );
  executeCommand = null;
}

if (executeCommand) {
  const proc = spawn(executeCommand, executeArgs, {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
}
