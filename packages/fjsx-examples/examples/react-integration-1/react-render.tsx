import _react from "react";
import ReactDOM from "react-dom";
import { ReactIntegrationWrapper } from "./integration-wrapper.react";

export const ReactRender = props => {
  var parent = document.createDocumentFragment();
  var integrationElement = _react.createElement(
    ReactIntegrationWrapper,
    null,
    props.children
  );
  var rendered = ReactDOM.render(integrationElement, parent);
  return rendered.integrationDomRef.current.firstElementChild;
};
