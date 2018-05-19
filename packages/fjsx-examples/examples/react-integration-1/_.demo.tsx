import _react from "react";
import { Button } from "./button.react";
import { ReactRender } from "./react-render";

// var reactBtn = _react.createElement("button", { key: 1 }, "Button 1");
var reactBtn = _react.createElement(
  Button,
  {
    key: 1
  },
  "Button 1"
);

const viewReactEntegration1 = (
  <div>
    <ReactRender>{reactBtn}</ReactRender>
  </div>
);

document.body.appendChild(viewReactEntegration1);
