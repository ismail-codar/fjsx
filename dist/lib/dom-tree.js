"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsxEventProperty = /^on[A-Z]/;
const svgNS = "http://www.w3.org/2000/svg";
exports.Fragment = Symbol("fjsx.Fragment");
const setElementAttributes = (element, attributes, forceSetAttr) => {
    let attribute = null;
    for (var attributeName in attributes) {
        attribute = attributes[attributeName];
        if (attribute instanceof Function) {
            if (jsxEventProperty.test(attributeName)) {
                attributeName = attributeName.toLowerCase();
                element[attributeName] = attribute;
            }
            else
                attribute(element);
        }
        else if (attribute instanceof Object) {
            //style
            for (var key in attribute)
                if (typeof attribute[key] === "function")
                    attribute[key](element);
        }
        else {
            if (forceSetAttr || attributeName.indexOf("-") !== -1)
                element.setAttribute(attributeName, attribute);
            else
                element[attributeName] = attribute;
        }
    }
};
exports.createElement = (tagName, attributes, ...childs) => {
    let element = null;
    if (tagName instanceof Function) {
        if (attributes === null)
            attributes = {};
        attributes["children"] = childs;
        element = tagName(attributes);
        if (element)
            element["$props"] = attributes;
    }
    else {
        if (tagName === exports.Fragment) {
            element = document.createDocumentFragment();
        }
        else {
            element = document.createElement(tagName);
            attributes && setElementAttributes(element, attributes, false);
        }
        element["$props"] = attributes;
        childs && childs.length && exports.addChildElements(element, childs);
    }
    return element;
};
exports.createSvgElement = (tagName, attributes, ...childs) => {
    let element = document.createElementNS(svgNS, tagName);
    attributes && setElementAttributes(element, attributes, true);
    childs && childs.length && exports.addChildElements(element, childs);
    return element;
};
exports.addChildElements = (element, childs) => {
    let props = null;
    for (var i = 0; i < childs.length; i++) {
        if (Array.isArray(childs[i]))
            exports.addChildElements(element, childs[i]);
        else if (childs[i] instanceof Function)
            childs[i](element);
        else {
            if (childs[i]) {
                props = childs[i]["$props"];
                element.appendChild(childs[i] instanceof Node
                    ? childs[i]
                    : document.createTextNode(childs[i]));
                props && props.didMount && props.didMount(element, childs[i]);
            }
        }
    }
};
exports.createTextNode = parent => {
    return parent.appendChild(document.createTextNode(""));
};
//# sourceMappingURL=dom-tree.js.map