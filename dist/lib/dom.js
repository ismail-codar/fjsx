"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_array_1 = require("./observable-array");
const f_1 = require("./f");
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
//# sourceMappingURL=dom.js.map