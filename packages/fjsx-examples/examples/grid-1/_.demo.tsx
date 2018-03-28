import { fjsx, FJsxValue } from "fjsx";
import { Grid1 } from "./view";
import { IGrid1 } from "./types";
import { cssLink } from "../util";

// https://vuejs.org/v2/examples/grid-component.html

const data: IGrid1 = {
  searchQuery: "",
  gridColumns: ["name", "power"],
  gridData: [
    { name: "Coşkun Göğen", power: Infinity },
    { name: "Cüneyt Arkın", power: 9000 },
    { name: "Süheyl Eğriboz", power: 7000 },
    { name: "Kadir İnanır", power: 8000 }
  ]
};

document.body.appendChild(<Grid1 {...data} />);

document.body.appendChild(cssLink("/examples/grid-1/style.css"));
