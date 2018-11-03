"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");
const t = require("@babel/types");
const fileExtentions = [".js", ".ts", ".tsx"];
const registryData = {};
const babelConfig = {
    presets: [
        "@babel/preset-typescript",
        "@babel/preset-react",
        "@babel/preset-env"
    ],
    plugins: []
};
function buildBabelConfig(plugin) {
    return Object.assign({}, babelConfig, {
        plugins: [plugin].concat(babelConfig.plugins)
    });
}
const getExportPaths = (fileName) => {
    const localExports = [];
    if (fs.existsSync(fileName)) {
        babel.transformFileSync(fileName, buildBabelConfig(() => {
            return {
                visitor: {
                    ExportNamedDeclaration(p) {
                        localExports.push.apply(localExports, getDeclations(p.node));
                    }
                }
            };
        }));
    }
    return localExports;
};
const getDeclations = (node) => {
    if (t.isFunctionDeclaration(node.declaration))
        return [node.declaration];
    else if (t.isVariableDeclaration(node.declaration))
        return node.declaration.declarations;
    else if (t.isTypeAlias(node.declaration))
        return [node.declaration];
    else
        return [];
};
const loadImportedFileExports = (fileName, importedFile) => {
    if (registryData[fileName])
        return registryData[fileName];
    else {
        importedFile = path.resolve(path.dirname(fileName), importedFile);
        fileExtentions.forEach(ext => {
            if (fs.existsSync(importedFile + ext)) {
                importedFile += ext;
            }
        });
        registryData[fileName] = getExportPaths(importedFile);
        return registryData[fileName];
    }
};
exports.exportRegistry = {
    loadImportedFileExports
};
//# sourceMappingURL=export-registry.js.map