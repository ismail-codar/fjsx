import React, { Component } from "react";
import ReactDOM from "react-dom";
import fjsx from "@fjsx/runtime";

export class ReactIntegrationWrapper extends Component {
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
  var parent = document.createDocumentFragment();
  var integrationElement = (
    <ReactIntegrationWrapper>
      <Tag {...attributes}>{childs}</Tag>
    </ReactIntegrationWrapper>
  );
  var rendered = ReactDOM.render(integrationElement, parent);
  return rendered.integrationDomRef.current.firstChild;
};
