import React, { Component } from "react";

export class ReactIntegrationWrapper extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <>{this.props.children}</>;
  }
}
