import RouteRecognizer from "route-recognizer";
import { fjsx } from "fjsx";
import { instance } from "./router";

export const Link = (props: { to: string; children: any }) => {
  const handleLinkClick: Fjsx.MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    let result = instance.recognize(props.to);
    for (var i = 0; i < result.length; i++) {
      var item = result[i] as any;
      item.handler();
    }
    // window.location.hash = props.to;
    window.history.pushState(null, null, props.to);
  };

  return fjsx.createElement(
    "a",
    { onClick: handleLinkClick, href: props.to },
    props.children
  );
};
