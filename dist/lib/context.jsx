"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appContext = {};
exports.getContextValue = (key, componentId) => {
    return null;
};
exports.Context = (props) => {
    const { key, value } = props;
    appContext[key] = value;
    //TODO childeren render süresince context geçerli olup render bitince kaybolmalı
    return <div>sss</div>;
};
//# sourceMappingURL=context.jsx.map