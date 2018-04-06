import { createRenderer } from "fela";
import { render } from "fela-dom";

const renderer = createRenderer();
render(renderer);

export const cssRules = (rule, params) => {
  if (!params) return renderer.renderRule(() => rule, {});
  else return renderer.renderRule(rule, params);
};
