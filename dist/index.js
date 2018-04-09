exports["fjsx"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="JSX.d.ts" />
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./lib/f */ "./lib/f.ts"));
__export(__webpack_require__(/*! ./lib/dom */ "./lib/dom.ts"));
__export(__webpack_require__(/*! ./lib/dom-tree */ "./lib/dom-tree.ts"));
__export(__webpack_require__(/*! ./lib/context */ "./lib/context.ts"));


/***/ }),

/***/ "./lib/context.ts":
/*!************************!*\
  !*** ./lib/context.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const appContext = {};
exports.startContext = (key, value) => {
    if (!appContext[key])
        appContext[key] = [];
    appContext[key].push(value);
};
exports.getContextValue = (key) => {
    if (appContext[key])
        return appContext[key][appContext[key].length - 1];
};
exports.endContext = (key) => {
    appContext[key].pop();
};
exports.Context = (props) => null;


/***/ }),

/***/ "./lib/dom-tree.ts":
/*!*************************!*\
  !*** ./lib/dom-tree.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./lib/dom.ts":
/*!********************!*\
  !*** ./lib/dom.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_array_1 = __webpack_require__(/*! ./observable-array */ "./lib/observable-array.ts");
const f_1 = __webpack_require__(/*! ./f */ "./lib/f.ts");
exports.conditionalElement = (parentElement, oldElement, newElement) => {
    if (newElement instanceof Node === false)
        newElement = document.createTextNode(newElement || "");
    if (oldElement)
        parentElement.replaceChild(newElement, oldElement);
    else
        parentElement.appendChild(newElement);
    return newElement;
};
exports.insertToDom = (parentElement, index, itemElement) => {
    if (itemElement instanceof Function)
        itemElement(parentElement);
    else {
        if (itemElement instanceof Node === false)
            itemElement = document.createTextNode(itemElement);
        parentElement.insertBefore(itemElement, parentElement.childNodes[index]);
    }
};
exports.arrayMap = (arr, parentDom, renderReturn) => {
    const oArr = arr.$val instanceof observable_array_1.ObservableArray
        ? arr.$val
        : new observable_array_1.ObservableArray(arr.$val);
    oArr.on("itemadded", function (e) {
        exports.insertToDom(parentDom, e.index, renderReturn(e.item, e.index));
    });
    oArr.on("itemset", function (e) {
        parentDom.replaceChild(renderReturn(e.item, e.index), parentDom.childNodes.item(e.index));
    });
    oArr.on("itemremoved", function (e) {
        parentDom.removeChild(parentDom.childNodes.item(e.index));
    });
    arr(oArr);
    const renderAll = () => {
        if (arr.$val.length === 0)
            parentDom.textContent = "";
        else {
            parentDom.textContent = "";
            for (var i = parentDom.childElementCount; i < arr.$val.length; i++)
                exports.insertToDom(parentDom, i, renderReturn(arr.$val[i], i));
        }
    };
    f_1.compute(renderAll, arr);
};


/***/ }),

/***/ "./lib/f.ts":
/*!******************!*\
  !*** ./lib/f.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const observable_array_1 = __webpack_require__(/*! ./observable-array */ "./lib/observable-array.ts");
exports.value = (value, freezed) => {
    const innerFn = (val) => {
        if (Array.isArray(val)) {
            // TODO https://github.com/WebReflection/majinbuu
            innerFn["$val"].innerArray = val;
        }
        else
            innerFn["$val"] = val;
        const computes = innerFn["computes"];
        if (computes.length)
            for (var i = 0; i < computes.length; i++)
                !computes[i]["freezed"] && computes[i](computes[i].compute());
    };
    innerFn["$val"] = value;
    innerFn["freezed"] = freezed;
    innerFn["computes"] = [];
    if (value instanceof Function)
        innerFn["compute"] = value;
    innerFn.toJSON = () => innerFn["$val"];
    return innerFn;
};
exports.array = (items) => {
    const arr = exports.value(new observable_array_1.ObservableArray(items));
    arr.on = arr.$val.on;
    arr.off = arr.$val.off;
    arr.toJSON = () => arr.$val.innerArray;
    return arr;
};
exports.on = (arr, type, callback) => {
    arr["$val"].on(type, callback);
};
exports.off = (arr, type, callback) => {
    arr["$val"].off(type, callback);
};
exports.compute = (fn, ...args) => {
    var compute = exports.value(fn);
    for (var i = 0; i < args.length; i++)
        args[i]["computes"].push(compute);
    fn();
};
exports.initCompute = (fn, ...args) => {
    var cValue = exports.value(fn());
    var cmpInner = function () {
        cValue(fn());
    };
    cmpInner["compute"] = cValue;
    for (var i = 0; i < args.length; i++)
        args[i]["computes"].push(cmpInner);
    return cValue;
};
exports.setCompute = (prev, fn, ...args) => {
    exports.destroy(prev);
    return exports.initCompute(fn, ...args);
};
exports.destroy = (item) => {
    delete item["compute"];
    delete item["computes"];
};


/***/ }),

/***/ "./lib/observable-array.ts":
/*!*********************************!*\
  !*** ./lib/observable-array.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// https://stackoverflow.com/questions/5100376/how-to-watch-for-array-changes
function ObservableArray(items) {
    var _self = this, _array = [], _handlers = {
        itemadded: [],
        itemremoved: [],
        itemset: []
    };
    function defineIndexProperty(index) {
        if (!(index in _self)) {
            Object.defineProperty(_self, index, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return _array[index];
                },
                set: function (v) {
                    _array[index] = v;
                    raiseEvent({
                        type: "itemset",
                        index: index,
                        item: v
                    });
                }
            });
        }
    }
    function raiseEvent(event) {
        _handlers[event.type].forEach(function (h) {
            h.call(_self, event);
        });
    }
    _self.on = function (eventName, handler) {
        _handlers[eventName].push(handler);
    };
    _self.off = function (eventName, handler) {
        var h = _handlers[eventName];
        var ln = h.length;
        while (--ln >= 0) {
            if (h[ln] === handler) {
                h.splice(ln, 1);
            }
        }
    };
    _self.push = function () {
        var index;
        for (var i = 0, ln = arguments.length; i < ln; i++) {
            index = _array.length;
            _array.push(arguments[i]);
            defineIndexProperty(index);
            raiseEvent({
                type: "itemadded",
                index: index,
                item: arguments[i]
            });
        }
        return _array.length;
    };
    _self.pop = function () {
        if (_array.length > -1) {
            var index = _array.length - 1, item = _array.pop();
            delete _self[index];
            raiseEvent({
                type: "itemremoved",
                index: index,
                item: item
            });
            return item;
        }
    };
    _self.unshift = function () {
        for (var i = 0, ln = arguments.length; i < ln; i++) {
            _array.splice(i, 0, arguments[i]);
            defineIndexProperty(_array.length - 1);
            raiseEvent({
                type: "itemadded",
                index: i,
                item: arguments[i]
            });
        }
        for (; i < _array.length; i++) {
            raiseEvent({
                type: "itemset",
                index: i,
                item: _array[i]
            });
        }
        return _array.length;
    };
    _self.shift = function () {
        if (_array.length > -1) {
            var item = _array.shift();
            delete _self[_array.length];
            raiseEvent({
                type: "itemremoved",
                index: 0,
                item: item
            });
            return item;
        }
    };
    _self.splice = function (index, howMany /*, element1, element2, ... */) {
        var removed = [], item, pos;
        index = index == null ? 0 : index < 0 ? _array.length + index : index;
        howMany =
            howMany == null ? _array.length - index : howMany > 0 ? howMany : 0;
        while (howMany--) {
            item = _array.splice(index, 1)[0];
            removed.push(item);
            delete _self[_array.length];
            raiseEvent({
                type: "itemremoved",
                index: index + removed.length - 1,
                item: item
            });
        }
        for (var i = 2, ln = arguments.length; i < ln; i++) {
            _array.splice(index, 0, arguments[i]);
            defineIndexProperty(_array.length - 1);
            raiseEvent({
                type: "itemadded",
                index: index,
                item: arguments[i]
            });
            index++;
        }
        return removed;
    };
    Object.defineProperty(_self, "length", {
        configurable: false,
        enumerable: false,
        get: function () {
            return _array.length;
        },
        set: function (value) {
            var n = Number(value);
            var length = _array.length;
            if (n % 1 === 0 && n >= 0) {
                if (n < length) {
                    _self.splice(n);
                }
                else if (n > length) {
                    _self.push.apply(_self, new Array(n - length));
                }
            }
            else {
                throw new RangeError("Invalid array length");
            }
            _array.length = n;
            return value;
        }
    });
    Object.defineProperty(_self, "innerArray", {
        configurable: false,
        enumerable: false,
        get: function () {
            return _array;
        },
        set: function (v) {
            // _self.push.apply(_self, v); // renderAll
            _array = v;
        }
    });
    Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
        if (!(name in _self)) {
            Object.defineProperty(_self, name, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: Array.prototype[name]
            });
        }
    });
    _self.toJSON = () => {
        return _array;
    };
    if (items instanceof Array) {
        _self.push.apply(_self, items);
    }
}
exports.ObservableArray = ObservableArray;


/***/ })

/******/ });
//# sourceMappingURL=index.js.map