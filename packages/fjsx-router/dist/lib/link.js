"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fjsx = require("@fjsx/runtime");
const router_1 = require("./router");
exports.Link = (props) => {
    const handleLinkClick = e => {
        e.preventDefault();
        router_1.transitionTo(props.to);
    };
    return fjsx.createElement("a", { onClick: handleLinkClick, href: props.to }, props.children);
};
//# sourceMappingURL=link.js.map