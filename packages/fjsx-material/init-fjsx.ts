import * as fjsxObj from "@fjsx/runtime";
import { jssStyleOrders } from "./src/utils/jss-css-rules";
import { MuiJssStyleOrders } from "./src/components/mui/_index";

declare global {
  var fjsx: typeof fjsxObj;
}

global["fjsx"] = fjsxObj;

jssStyleOrders(MuiJssStyleOrders);

// NOTE: If you don't want to use fjsx instance globally
// you must put < import {fjsx} from "fjsx" > code in every view.
