import RouteRecognizer from "route-recognizer";
import { fjsx } from "fjsx";
export const instance = new RouteRecognizer();

export const transitionTo = (path: string) => {
  let result = instance.recognize(path);
  for (var i = 0; i < result.length; i++) {
    var item = result[i] as any;
    item.handler();
  }
  // window.location.hash = props.to;
  window.history.pushState(null, null, path);
};

export const Router = (props: any) => {
  setTimeout(() => {
    transitionTo(window.location.pathname);
  }, 0);
  const args = ["div", { className: "fjsx-router-root" }].concat(
    props.children
  );
  return fjsx.createElement.apply(null, args);
};
