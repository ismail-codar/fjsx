"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fjsx_1 = require("fjsx");
const router_1 = require("./router");
exports.Route = (props) => {
    let viewParent = null;
    router_1.instance.add([
        {
            path: props.path,
            handler: () => {
                const rendered = props.component();
                if (viewParent.firstChild)
                    viewParent.replaceChild(rendered, viewParent.firstChild);
                else
                    viewParent.appendChild(rendered);
            }
        }
    ]);
    props.didMount = parent => {
        viewParent = parent;
    };
    return fjsx_1.fjsx.createElement(fjsx_1.fjsx.Fragment, null);
};
//# sourceMappingURL=route.js.map