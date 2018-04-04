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
//# sourceMappingURL=context.js.map