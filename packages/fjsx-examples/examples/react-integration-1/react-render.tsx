import ReactDOM from "react-dom";

export const ReactRender = props => {
  var parent = document.createDocumentFragment();
  var rendered = ReactDOM.render(props.children, parent);
  return rendered.myRef.current;
};
