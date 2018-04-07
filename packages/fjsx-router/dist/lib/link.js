"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fjsx_1 = require("fjsx");
const router_1 = require("./router");
exports.Link = (props) => {
    const handleLinkClick = e => {
        e.preventDefault();
        let result = router_1.instance.recognize(props.to);
        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            item.handler();
        }
        // window.location.hash = props.to;
        window.history.pushState(null, null, props.to);
    };
    return fjsx_1.fjsx.createElement("a", { onClick: handleLinkClick, href: props.to }, props.children);
};
//# sourceMappingURL=link.js.map