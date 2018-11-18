"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("@babel/types");
const found_1 = require("./found");
const svg_1 = require("./svg");
const COMMENT_TRACKED = '@tracked';
const COMMENT_NON_TRACKED = '@untracked';
const COMMENT_TRACK_KEYS = '@track_keys';
const specialMemberAccessKeywords = ['$val', 'freezed'];
exports.checker = {
    literalTracked: (name) => {
        return name.endsWith('$');
    },
    commentTracked: (text) => {
        return text.trim().startsWith(COMMENT_TRACKED);
    },
    commentTrackedSet: (text) => {
        return text.trim() === COMMENT_TRACKED + '_set';
    },
    commentHasTrackKeys: (text) => {
        return text.indexOf(COMMENT_TRACK_KEYS) !== -1;
    },
    commentHasTrackKey: (text, keyName) => {
        const str = text.substr(text.indexOf(COMMENT_TRACK_KEYS) + COMMENT_TRACK_KEYS.length + 1).trim();
        return str.split('|').indexOf(keyName) !== -1;
    },
    commentNonTracked: (text) => { }
};
const isTrackedByNodeName = (node) => {
    if (t.isUnaryExpression(node))
        node = node.argument;
    const nodeName = t.isIdentifier(node) || t.isJSXIdentifier(node)
        ? node.name
        : t.isMemberExpression(node)
            ? node.property.name
            : t.isVariableDeclarator(node) && t.isIdentifier(node.id) ? node.id.name : null;
    return nodeName && exports.checker.literalTracked(nodeName) && specialMemberAccessKeywords.indexOf(nodeName) === -1;
};
const leadingCommentsFromPath = (path) => {
    let leadingComments = null;
    if (t.isProgram(path.parent)) {
        const searchName = t.isExpressionStatement(path.node) &&
            t.isAssignmentExpression(path.node.expression) &&
            t.isIdentifier(path.node.expression.left)
            ? path.node.expression.left.name
            : null;
        if (!searchName)
            return null;
        path.parent.body.every((item) => {
            if (t.isVariableDeclaration(item)) {
                item.declarations.every((decl) => {
                    if (t.isVariableDeclarator(decl) && t.isIdentifier(decl.id) && decl.id.name === searchName) {
                        leadingComments = item.leadingComments;
                    }
                    return leadingComments === null;
                });
                return leadingComments === null;
            }
        });
    }
    else {
        if (path.isImportSpecifier(path.node)) {
            //TODO use export-sources
            return path.parent.trailingComments;
        }
        leadingComments = path.parent.leadingComments;
        if (t.isExportNamedDeclaration(path.parentPath.parent))
            leadingComments = path.parentPath.parent.leadingComments;
    }
    return leadingComments;
};
const leadingCommentsHasTracked = (leadingComments) => {
    if (leadingComments == null)
        return false;
    return leadingComments.find((comment) => exports.checker.commentTracked(comment.value)) != null;
};
const hasTrackedComment = (path) => {
    let leadingComments = leadingCommentsFromPath(path);
    return leadingCommentsHasTracked(leadingComments);
};
const hasTrackedSetComment = (path) => {
    let leadingComments = leadingCommentsFromPath(path);
    if (leadingComments == null)
        return false;
    return leadingComments.find((comment) => exports.checker.commentTrackedSet(comment.value)) != null;
};
const hasTrackedKeyComment = (leadingComments, keyName) => {
    if (!leadingComments)
        return false;
    const comment = leadingComments.find((item) => exports.checker.commentHasTrackKeys(item.value));
    if (!comment)
        return false;
    return exports.checker.commentHasTrackKey(comment.value, keyName);
};
const isTrackedVariable = (scope, node) => {
    if (!node)
        return false;
    if (isTrackedByNodeName(node))
        return true;
    if (leadingCommentsHasTracked(node.leadingComments)) {
        return true;
    }
    if (t.isMemberExpression(node) && t.isIdentifier(node.object)) {
        // var object1 = {
        //   // @tracked
        //   property1: 1
        // };
        let variableBinding = found_1.found.variableBindingInScope(scope, node.object.name);
        if (variableBinding &&
            t.isVariableDeclarator(variableBinding.path.node) &&
            t.isObjectExpression(variableBinding.path.node.init)) {
            const property = variableBinding.path.node.init.properties.find((item) => t.isObjectProperty(item) && item.key.name === node.property.name);
            if (property)
                return leadingCommentsHasTracked(property.leadingComments);
        }
    }
    let searchName = t.isIdentifier(node) ? node.name : null;
    let variableBinding = searchName && found_1.found.variableBindingInScope(scope, searchName);
    if (variableBinding) {
        if (t.isImportSpecifier(variableBinding.path.node) && hasTrackedComment(variableBinding.path)) {
            //TODO use export-sources
            return true;
        }
        else if (t.isVariableDeclarator(variableBinding.path.node) &&
            t.isVariableDeclaration(variableBinding.path.parent) &&
            hasTrackedComment(variableBinding.path)) {
            return true;
        }
    }
    return false;
};
const isTrackedKey = (scope, node) => {
    const variableBinding = t.isIdentifier(node.object) ? found_1.found.variableBindingInScope(scope, node.object.name) : null;
    if (variableBinding && hasTrackedKeyComment(variableBinding.path.node.leadingComments, node.property.name))
        return true;
};
const isFjsxName = (str) => str.indexOf('fjsx') !== -1;
const fjsxValueBinaryInit = (
// fjsx.value(a.$val + b.$val); gibi mi diye bak
expression) => {
    return (t.isCallExpression(expression) &&
        expression.arguments.length == 1 &&
        t.isBinaryExpression(expression.arguments[0]) &&
        t.isMemberExpression(expression.callee) &&
        t.isIdentifier(expression.callee.object) &&
        isFjsxName(expression.callee.object.name) &&
        t.isIdentifier(expression.callee.property) &&
        expression.callee.property.name == 'value');
};
const parentPathComputeCallee = (path) => {
    if (!path.parentPath || !path.parentPath.parentPath || !path.parentPath.parentPath.parentPath)
        return false;
    const parentPath = path.parentPath.parentPath.parentPath;
    if (t.isCallExpression(parentPath.node) && t.isIdentifier(parentPath.node.callee))
        return parentPath.node.callee.name === 'fjsx.compute';
    else
        return false;
};
/**
 * function (element) {
      fjsx.compute... control
    }
 */
const isFjsxElementFunction = (node) => {
    if (t.isFunctionExpression(node) && node.params.length === 1) {
        const param0 = node.params[0];
        if (t.isIdentifier(param0))
            return param0.name === 'element';
    }
    return false;
};
const expressionContainerParentIsComponent = (path) => {
    if (path.parentPath &&
        path.parentPath.parentPath &&
        t.isJSXOpeningElement(path.parentPath.parentPath.node) &&
        t.isJSXIdentifier(path.parentPath.parentPath.node.name)) {
        const name = path.parentPath.parentPath.node.name.name;
        return name.substr(0, 1).toUpperCase() == name.substr(0, 1) && !name.endsWith('_');
    }
};
const objectPropertyParentIsComponent = (path) => {
    if (Array.isArray(path.parentPath.container) && path.parentPath.container.length) {
        const foundPath = found_1.found.parentPathFound(path, (checkPath) => t.isJSXOpeningElement(checkPath.node));
        if (t.isJSXIdentifier(foundPath.node.name)) {
            const name = foundPath.node.name.name;
            return name !== null && name.substr(0, 1).toUpperCase() == name.substr(0, 1) && !name.endsWith('_');
        }
        else if (t.isJSXMemberExpression(foundPath.node.name)) {
            const name = foundPath.node.name.property.name;
            return name !== null && name.substr(0, 1).toUpperCase() == name.substr(0, 1) && !name.endsWith('_');
        }
        else
            return false;
        // let name: string = null;
        // const container = path.parentPath.container[0];
        // if (t.isIdentifier(container)) name = container.name;
        // else if (t.isJSXAttribute(container)) name = container.name.name.toString();
    }
    while (path) {
        if (t.isCallExpression(path.node) &&
            t.isMemberExpression(path.node.callee) &&
            t.isIdentifier(path.node.callee.object) &&
            isFjsxName(path.node.callee.object.name) &&
            t.isIdentifier(path.node.callee.property) &&
            path.node.callee.property.name === 'createElement') {
            const arg0 = path.node.arguments[0];
            return (t.isIdentifier(arg0) &&
                arg0.name.substr(0, 1).toUpperCase() == arg0.name.substr(0, 1) &&
                !arg0.name.endsWith('_'));
        }
        else
            path = path.parentPath;
    }
    return false;
};
exports.isExportsMember = (expression) => {
    if (t.isMemberExpression(expression) && t.isIdentifier(expression.object) && expression.object.name === 'exports')
        return true;
};
exports.isValMemberProperty = (node) => {
    return t.isMemberExpression(node) && t.isIdentifier(node.property) && node.property.name === '$val';
};
exports.isArrayMapExpression = (scope, expression) => {
    return (t.isMemberExpression(expression.callee) &&
        expression.callee.property.name == 'map' &&
        (exports.check.isValMemberProperty(expression.callee.object) ||
            exports.check.isTrackedVariable(scope, expression.callee.object)));
};
exports.isFjsxCall = (node) => {
    if (!t.isCallExpression(node))
        return false;
    const member = found_1.found.callExpressionFirstMember(node);
    return member && isFjsxName(member.name);
};
exports.isDynamicExpression = (expression) => t.isBinaryExpression(expression) ||
    t.isLogicalExpression(expression) ||
    t.isConditionalExpression(expression) ||
    (t.isCallExpression(expression) &&
        !(t.isMemberExpression(expression.callee) &&
            t.isIdentifier(expression.callee.object) &&
            isFjsxName(expression.callee.object.name)));
exports.isSvgElementTagName = (tagName, openedTags) => {
    return ((tagName != null && svg_1.allSvgElements.indexOf(tagName) !== -1) ||
        (svg_1.htmlAndSvgElements.indexOf(tagName) !== -1 && svg_1.allSvgElements.indexOf(openedTags[openedTags.length - 1]) !== -1));
};
exports.check = {
    isFjsxName,
    isFjsxCall: exports.isFjsxCall,
    isValMemberProperty: exports.isValMemberProperty,
    isTrackedByNodeName,
    hasTrackedComment,
    hasTrackedSetComment,
    hasTrackedKeyComment,
    isTrackedVariable,
    isTrackedKey,
    specialMemberAccessKeywords,
    fjsxValueBinaryInit,
    parentPathComputeCallee,
    expressionContainerParentIsComponent,
    objectPropertyParentIsComponent,
    isExportsMember: exports.isExportsMember,
    isArrayMapExpression: exports.isArrayMapExpression,
    isDynamicExpression: exports.isDynamicExpression,
    isSvgElementTagName: exports.isSvgElementTagName,
    isFjsxElementFunction
};
//# sourceMappingURL=check.js.map