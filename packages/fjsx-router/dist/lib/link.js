"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fjsx_1 = require("fjsx");
const router_1 = require("./router");
exports.Link = (props) => {
    const handleLinkClick = e => {
        e.preventDefault();
        router_1.transitionTo(props.to);
    };
    return fjsx_1.fjsx.createElement("a", { onClick: handleLinkClick, href: props.to }, props.children);
};
//# sourceMappingURL=link.js.map