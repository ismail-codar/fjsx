import fjsx from "@fjsx/runtime";

import warning from "warning";
import { create, SheetsManager } from "jss";
import jssPreset from "../styles/jssPreset";
import createMuiTheme from "../styles/createMuiTheme";
import createGenerateClassName from "../styles/createGenerateClassName";
import getStylesCreator from "../styles/getStylesCreator";

// Default JSS instance.
const presets = jssPreset();
export const jss = create(presets);
const manager = new SheetsManager();

// Use a singleton or the provided one by the context.
const generateClassName = createGenerateClassName();

var INDEX = 999;

export const jssCssRulesWithTheme = (
  name,
  props,
  stylesOrCreator,
  dynamicCss = undefined
) => {
  dynamicCss = dynamicCss || stylesOrCreator instanceof Function;
  const stylesCreator = getStylesCreator(stylesOrCreator);
  stylesCreator.create(fjsx.getContextValue("theme"), name);

  const styles = stylesCreator.create(fjsx.getContextValue("theme"), name);
  var sheet = jss.createStyleSheet(styles, {
    name,
    meta: name,
    generateClassName,
    classNamePrefix: name,
    link: false,
    index: INDEX--
  });

  const key = dynamicCss ? JSON.stringify(styles) : styles;
  if (!manager.get(key)) {
    manager.add(key, sheet);
    manager.manage(key);
  } else sheet = manager.get(key);

  return sheet.classes;
};
