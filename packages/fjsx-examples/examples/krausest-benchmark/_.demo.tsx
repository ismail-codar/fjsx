import "./css/bootstrap/css/bootstrap.min.css";
import "./css/main.css";
import { DemoView } from "./view";

import * as state from "./state";
import * as handlers from "./handlers";
import { cssLink } from "../util";

export const DEMO = () => {
  return {
    title: "js-framework-benchmark",
    demos: {
      View: <DemoView state={state} handlers={handlers} />
    }
  };
};

document.body.appendChild(cssLink("/assets/main.css"));
document.body.appendChild(cssLink("/assets/bootstrap.min.css"));
