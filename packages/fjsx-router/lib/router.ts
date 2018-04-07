import RouteRecognizer from "route-recognizer";
import { fjsx } from "fjsx";
export const instance = new RouteRecognizer();

export const Router = (props: any) => {
  const args = ["div", { className: "fjsx-router-root" }].concat(
    props.children
  );
  return fjsx.createElement.apply(null, args);
};
