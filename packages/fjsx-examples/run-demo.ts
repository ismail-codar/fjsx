import { fjsx as fjsxObj } from "../index";

declare global {
  var fjsx: typeof fjsxObj;
  var fbR: any;
}

global["fjsx"] = fjsxObj;

const DEMO = require("../scripts/_demo").view.DEMO();

const demoDiv = document.getElementById("main");
const header = document.createElement("h4");
header.innerHTML = DEMO.title;
demoDiv.appendChild(header);
for (var key in DEMO.demos) {
  demoDiv.appendChild(DEMO.demos[key]);
}
