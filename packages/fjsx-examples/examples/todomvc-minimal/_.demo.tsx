import { fjsx, FJsxValue } from "fjsx";
import { DemoView } from "./view";
import { cssLink } from "../util";

const data: FJsxValue<boolean> = fjsx.value(false);

export const DEMO = () => {
  return {
    title: "TodoMVC",
    demos: {
      View: <DemoView data={data} />
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
