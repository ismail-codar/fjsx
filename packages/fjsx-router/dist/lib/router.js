"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_recognizer_1 = require("route-recognizer");
const fjsx_1 = require("fjsx");
exports.instance = new route_recognizer_1.default();
exports.Router = (props) => {
    const args = ["div", { className: "fjsx-router-root" }].concat(props.children);
    return fjsx_1.fjsx.createElement.apply(null, args);
};
//# sourceMappingURL=router.js.map