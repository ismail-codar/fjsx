import RouteRecognizer from "route-recognizer";
import * as fjsx from "@fjsx/runtime";
import { instance, transitionTo } from "./router";

export const Link = (props: { to: string; children: any }) => {
  const handleLinkClick: Fjsx.MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    transitionTo(props.to);
  };

  return fjsx.createElement(
    "a",
    { onClick: handleLinkClick, href: props.to },
    props.children
  );
};
