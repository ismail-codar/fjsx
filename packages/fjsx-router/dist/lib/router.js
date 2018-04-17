"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_recognizer_1 = require("route-recognizer");
const fjsx = require("@fjsx/runtime");
exports.instance = new route_recognizer_1.default();
exports.transitionTo = (path) => {
    let result = exports.instance.recognize(path);
    if (result) {
        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            item.handler();
        }
        // window.location.hash = props.to;
        window.history.pushState(null, null, path);
    }
};
exports.Router = (props) => {
    setTimeout(() => {
        exports.transitionTo(window.location.pathname);
    }, 0);
    const args = ["div", { className: "fjsx-router-root" }].concat(props.children);
    return fjsx.createElement.apply(null, args);
};
//# sourceMappingURL=router.js.map