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

// TODO manager.unmanage when unmount (all)

// Use a singleton or the provided one by the context.
const generateClassName = createGenerateClassName();

var INDEX = Number.MAX_SAFE_INTEGER;

var styleOrders: string[] = [];
export const jssStyleOrders = (names: string[]) => {
  if (!names) return styleOrders;
  else {
    styleOrders = names;
  }
};

export const jssCssRulesWithTheme = (
  name,
  props,
  stylesOrCreator,
  dynamicCss = undefined
) => {
  dynamicCss = dynamicCss || stylesOrCreator instanceof Function;
  const stylesCreator = getStylesCreator(stylesOrCreator);

  const theme = fjsx.getContextValue("theme", props);
  if (props) props.theme = theme;
  const styles = stylesCreator.create(theme, name);

  const index = styleOrders.indexOf(name);

  //TODO detect theme changes and unmanage (buttons:MuiThemeProvider)

  var key = dynamicCss ? JSON.stringify(styles) : styles;
  if (!manager.get(key)) {
    var sheet = jss.createStyleSheet(styles, {
      name,
      meta: name,
      generateClassName,
      classNamePrefix: name,
      link: false,
      index: index !== -1 ? index : INDEX--
    });
    manager.add(key, sheet);
    manager.manage(key);
  } else {
    sheet = manager.get(key);
  }

  const classes = Object.assign({}, sheet.classes);
  if (props && props.classes) {
    for (key in props.classes) {
      classes[key] = (classes[key] || "") + " " + props.classes[key];
    }
  }
  return classes;
};
