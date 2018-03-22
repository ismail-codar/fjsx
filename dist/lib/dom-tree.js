"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsxEventProperty = /^on[A-Z]/;
exports.createElement = (tagName, attributes, ...childs) => {
    if (tagName instanceof Function) {
        if (attributes === null)
            attributes = {};
        attributes["children"] = childs;
        return tagName(attributes);
    }
    const element = document.createElement(tagName);
    if (attributes) {
        let attribute = null;
        for (var attributeName in attributes) {
            attribute = attributes[attributeName];
            if (attribute instanceof Function) {
                if (jsxEventProperty.test(attributeName)) {
                    if (attributeName === "onDomCreate") {
                        attributes[attributeName](element);
                    }
                    else {
                        attributeName = attributeName.toLowerCase();
                        element[attributeName] = attribute;
                    }
                }
                else
                    attribute(element);
            }
            else if (attribute instanceof Object) {
                //style
                for (var key in attribute) {
                    if (typeof attribute[key] === "function") {
                        attribute[key](element);
                    }
                    else {
                        if (attributeName === "style") {
                            //TODO styles
                        }
                        else {
                            throw attributeName + " type is object";
                        }
                    }
                }
            }
            else {
                if (attributeName.indexOf("-") !== -1)
                    element.setAttribute(attributeName, attribute);
                else
                    element[attributeName] = attribute;
            }
        }
    }
    if (childs && childs.length) {
        let child = null;
        for (var i = 0; i < childs.length; i++) {
            if (Array.isArray(childs[i])) {
                //TODO flatMap
                for (var c = 0; c < childs[i].length; c++) {
                    child = childs[i][c];
                    element.appendChild(
                    // TODO compileTime createTextNode çağrılacak
                    child instanceof Node ? child : document.createTextNode(child));
                }
            }
            else if (childs[i] instanceof Function) {
                childs[i](element);
            }
            else {
                child = childs[i];
                element.appendChild(
                // TODO compileTime createTextNode çağrılacak
                child instanceof Node ? child : document.createTextNode(child));
            }
        }
    }
    return element;
};
exports.createTextNode = parent => {
    return parent.appendChild(document.createTextNode(""));
};
//# sourceMappingURL=dom-tree.js.map