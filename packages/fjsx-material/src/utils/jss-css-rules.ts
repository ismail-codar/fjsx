import fjsx from "@fjsx/runtime";

import warning from "warning";
import { create } from "jss";
import jssPreset from "../styles/jssPreset";
import createMuiTheme from "../styles/createMuiTheme";
import createGenerateClassName from "../styles/createGenerateClassName";
import getStylesCreator from "../styles/getStylesCreator";

// Default JSS instance.
const presets = jssPreset();
const jss = create(presets);

// Use a singleton or the provided one by the context.
const generateClassName = createGenerateClassName();

export const jssCssRulesWithTheme = (name, props, stylesOrCreator) => {
  const stylesCreator = getStylesCreator(stylesOrCreator);
  stylesCreator.create(fjsx.getContextValue("theme"), name);

  const styles = stylesCreator.create(fjsx.getContextValue("theme"), name);
  const sheet = jss.createStyleSheet(styles, {
    name,
    meta: name,
    generateClassName,
    classNamePrefix: name,
    link: false
  });

  sheet.attach();
  return sheet.classes;
};
