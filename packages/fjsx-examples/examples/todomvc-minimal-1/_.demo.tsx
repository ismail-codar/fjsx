import fjsx, { FJsxValue } from "fjsx";
import { DemoView } from "./view";
import { cssLink } from "../util";

export const DEMO = () => {
  return {
    title: "TodoMVC",
    demos: {
      View: <DemoView />
    }
  };
};

document.body.appendChild(
  cssLink(
    "http://todomvc.com/examples/react/node_modules/todomvc-common/base.css"
  )
);
document.body.appendChild(
  cssLink(
    "http://todomvc.com/examples/react/node_modules/todomvc-app-css/index.css"
  )
);
