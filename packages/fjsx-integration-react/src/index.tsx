import React, { Component } from "react";
import ReactDOM from "react-dom";
import fjsx from "@fjsx/runtime";

class ReactIntegrationWrapper extends Component {
  integrationDomRef;
  constructor(props) {
    super(props);
    this.integrationDomRef = React.createRef();
  }
  render() {
    return <div ref={this.integrationDomRef}>{this["props"].children}</div>;
  }
}

fjsx["createElementByReact"] = (Tag, attributes, ...childs: any[]) => {
  // var parent = document.createDocumentFragment(); https://github.com/facebook/react/issues/12051 onClick binds emptyFunction
  var parent = document.createElement("div");
  var integrationElement = (
    <ReactIntegrationWrapper>
      <Tag {...attributes}>{childs}</Tag>
    </ReactIntegrationWrapper>
  );
  var rendered = ReactDOM.render(integrationElement, parent);
  return rendered.integrationDomRef.current.firstChild;
};
