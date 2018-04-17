"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const fjsx = require("@fjsx/runtime");
exports.Route = (props) => {
    let viewParent = null;
    router_1.instance.add([
        {
            path: props.path,
            handler: () => {
                fjsx.activateContext(props["$context"]);
                const rendered = props.component(props);
                if (viewParent.firstChild)
                    viewParent.replaceChild(rendered, viewParent.firstChild);
                else
                    viewParent.appendChild(rendered);
                fjsx.deactivateContext(props["$context"]);
            }
        }
    ]);
    props.didMount = parent => {
        viewParent = parent;
    };
    return fjsx.createElement(fjsx.Fragment, null);
};
//# sourceMappingURL=route.js.map