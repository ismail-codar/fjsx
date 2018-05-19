import React, { Component } from "react";

// export class Button extends Component {
//   myRef: null;
//   constructor(props) {
//     super(props);
//     this.myRef = React.createRef();
//   }
//   render() {
//     const props = this["props"];
//     return <button ref={this.myRef}>{props.children}</button>;
//   }
// }

export const Button = props => {
  return <button>{props.children}..</button>;
};
