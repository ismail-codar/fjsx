"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_tree_1 = require("./dom-tree");
const appContext = {};
exports.getContextValue = (key) => {
    return appContext[key];
};
exports.Context = (props) => {
    const { key, value, children } = props;
    appContext[key] = value;
    console.log("appContext", key, value);
    props.onAfterMount = () => {
        appContext[key] = null;
    };
    debugger;
    const element = document.createDocumentFragment();
    dom_tree_1.addChildElements(element, children);
    return element;
};
//# sourceMappingURL=context.jsx.map