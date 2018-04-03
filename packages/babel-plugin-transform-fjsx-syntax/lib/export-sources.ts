//https://github.com/Xiphe/babel-get-export-sources/blob/master/src/index.js
const path = require("path");

function hasRelativeSource(p) {
  return (
    p.node.source &&
    p.node.source.value &&
    p.node.source.value.indexOf(".") === 0
  );
}

export function getExportSource(entry, babel, babelConfig) {
  function buildBabelConfig(plugin) {
    return Object.assign({}, babelConfig, {
      plugins: [plugin].concat(babelConfig.plugins)
    });
  }

  function findInScope(scope, name) {
    if (!scope.hasBinding(name)) {
      return undefined;
    }

    if (scope.bindings[name]) {
      return scope.bindings[name].path;
    }

    if (!scope.parent) {
      return undefined;
    }

    return findInScope(scope.parent, name);
  }

  function resolveIdentifyer(p) {
    if (p.isIdentifier()) {
      const dec = findInScope(p.scope, p.get("name").node);

      if (dec) {
        return resolveIdentifyer(dec);
      }
    }

    if (p.isFunctionDeclaration()) {
      const rets = [];

      p.traverse({
        ReturnStatement(subP) {
          rets.push(subP);
        }
      });

      return rets.reduce((result, ret) => {
        return result.concat(resolveIdentifyer(ret.get("argument")));
      }, []);
    }

    if (p.isVariableDeclarator()) {
      return resolveIdentifyer(p.get("init"));
    }

    if (p.isDeclaration()) {
      return resolveIdentifyer(p.get("declaration"));
    }

    if (p.isCallExpression()) {
      return p
        .get("arguments")
        .reduce((result, arg) => {
          return result.concat(resolveIdentifyer(arg));
        }, [])
        .concat(resolveIdentifyer(p.get("callee")));
    }

    return p;
  }

  function flatten(arr) {
    return arr.reduce((result, impts) => {
      return result.concat(impts);
    }, []);
  }

  function findSourceFiles(expt) {
    return getExportPaths(expt.src) // eslint-disable-line
      .then(childExpts => {
        if (expt.node.type === "ExportAllDeclaration") {
          const ret = Object.assign({}, childExpts);
          delete ret["default"];

          return ret;
        }

        if (expt.node.type === "ExportDefaultDeclaration" && expt.indirect) {
          return {
            default: childExpts[expt.indirect.imported.name]
          };
        }

        /* istanbul ignore else */
        if (expt.node.type === "ExportNamedDeclaration") {
          return expt.node.specifiers.reduce((result, specifier) => {
            const member = {};
            member[specifier.exported.name] = childExpts[specifier.local.name];
            return Object.assign({}, result, member);
          }, {});
        }

        /* This should not happen and tests for that case would be absurd :) */
        /* istanbul ignore next */
        return Promise.reject(
          new Error("unexpected node type " + expt.node.type)
        );
      });
  }

  function resolveToExport(p, file) {
    const imports = [].concat(resolveIdentifyer(p)).filter(resP => {
      return (
        (resP.isImportDeclaration() ||
          resP.isImportDefaultSpecifier() ||
          resP.isImportSpecifier()) &&
        hasRelativeSource(resP.parentPath)
      );
    });

    return flatten(imports).map(imptP => {
      return {
        node: p.node,
        indirect: imptP.node,
        src: require.resolve(
          path.resolve(path.dirname(file), imptP.parentPath.node.source.value)
        )
      };
    });
  }

  function getDeclaredNames(node) {
    if (!node.declaration) {
      return node.specifiers.map(specifier => specifier.exported.name);
    }

    if (node.declaration.type === "FunctionDeclaration") {
      return [node.declaration.id.name];
    }

    /* istanbul ignore else */
    if (node.declaration.type === "VariableDeclaration") {
      return node.declaration.declarations.map(decl => decl.id.name);
    }

    if (node.declaration.type === "TypeAlias") {
      return [node.declaration.id.name];
    }

    if (node.declaration.type === "TSInterfaceDeclaration") {
      // TODO TSInterfaceDeclaration
      return [];
    }
    /* This should not happen and tests for that case would be absurd :) */
    /* istanbul ignore next */
    throw new Error("unknown declaration");
  }

  function getExportPaths(file) {
    return new Promise((resolve, reject) => {
      const directExports = [];
      const indirectExports = [];
      const localExports = {};

      function registerDirectExport(p) {
        if (hasRelativeSource(p)) {
          directExports.push({
            node: p.node,
            src: require.resolve(
              path.resolve(path.dirname(file), p.node.source.value)
            )
          });
        }
      }

      function findExports() {
        return {
          visitor: {
            ExportNamedDeclaration(p) {
              if (p.node.source) {
                registerDirectExport(p);
                return;
              }

              getDeclaredNames(p.node).forEach(name => {
                localExports[name] = file;
              });
            },
            ExportAllDeclaration: registerDirectExport,
            ExportDefaultDeclaration(p) {
              indirectExports.push(resolveToExport(p, file));
              localExports["default"] = file;
            }
          }
        };
      }

      babel.transformFile(file, buildBabelConfig(findExports), err => {
        if (err) {
          return reject(err);
        }

        return Promise.all(
          directExports.concat(flatten(indirectExports)).map(findSourceFiles)
        )
          .then(results => {
            return results.reduce((result, r) => {
              return Object.assign({}, result, r);
            }, {});
          })
          .then(resolvedForeignImports => {
            const ret = Object.assign({}, localExports, resolvedForeignImports);
            return resolve(
              Object.keys(ret).reduce((r, key) => {
                if (ret[key]) {
                  r[key] = ret[key]; // eslint-disable-line
                }

                return r;
              }, {})
            );
          })
          .catch(reject);
      });
    });
  }

  return getExportPaths(entry);
}
