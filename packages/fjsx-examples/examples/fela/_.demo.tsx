import { createRenderer } from "fela";
import { render } from "fela-dom";

// a simple style rule is a pure function of state
// that returns an object of style declarations
const rule = state => ({
  textAlign: "center",
  padding: "5px 10px",
  // directly use the state to compute style values
  background: state.primary ? "green" : "blue",
  fontSize: "18pt",
  borderRadius: 5,
  // deeply nest media queries and pseudo classes
  ":hover": {
    background: state.primary ? "chartreuse" : "dodgerblue",
    boxShadow: "0 0 2px rgb(70, 70, 70)"
  }
});

const renderer = createRenderer();
render(renderer);

// fela generates atomic CSS classes in order to achieve
// maximal style reuse and minimal CSS output
const className = renderer.renderRule(rule, {
  primary: true
});

console.log(renderer);

const view = <button className={className}>button 1</button>;

document.body.appendChild(view);
