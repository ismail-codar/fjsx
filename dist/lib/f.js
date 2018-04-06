"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_array_1 = require("./observable-array");
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
//# sourceMappingURL=f.js.map