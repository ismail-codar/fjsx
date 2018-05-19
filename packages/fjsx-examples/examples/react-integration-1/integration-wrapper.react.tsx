import React, { Component } from "react";

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
