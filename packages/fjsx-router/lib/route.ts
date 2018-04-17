import { instance } from "./router";
import * as fjsx from "@fjsx/runtime";

export const Route = (props: {
  exact?: boolean;
  path: string;
  didMount?: any;
  component: (props) => Element;
}) => {
  let viewParent: HTMLDivElement = null;

  instance.add([
    {
      path: props.path,
      handler: () => {
        fjsx.activateContext(props["$context"]);
        const rendered = props.component(props);
        if (viewParent.firstChild)
          viewParent.replaceChild(rendered, viewParent.firstChild);
        else viewParent.appendChild(rendered);
        fjsx.deactivateContext(props["$context"]);
      }
    }
  ]);

  props.didMount = parent => {
    viewParent = parent;
  };

  return fjsx.createElement(fjsx.Fragment, null);
};
