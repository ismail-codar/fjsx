import { fjsx } from "fjsx";
import { instance } from "./router";

export const Route = (props: {
  exact?: boolean;
  path: string;
  didMount?: any;
  component: () => Element;
}) => {
  let viewParent: HTMLDivElement = null;

  instance.add([
    {
      path: props.path,
      handler: () => {
        const rendered = props.component();
        if (viewParent.firstChild)
          viewParent.replaceChild(rendered, viewParent.firstChild);
        else viewParent.appendChild(rendered);
      }
    }
  ]);

  props.didMount = parent => {
    viewParent = parent;
  };

  return fjsx.createElement(fjsx.Fragment, null);
};
