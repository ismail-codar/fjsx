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
        for (var key in props["$context"])
          fjsx.startContext(key, props["$context"][key]);
        const rendered = props.component(props);
        if (viewParent.firstChild)
          viewParent.replaceChild(rendered, viewParent.firstChild);
        else viewParent.appendChild(rendered);
        for (var key in props["$context"]) fjsx.endContext(key);
      }
    }
  ]);

  props.didMount = parent => {
    viewParent = parent;
  };

  return fjsx.createElement(fjsx.Fragment, null);
};
