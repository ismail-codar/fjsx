import fjsx from "@fjsx/runtime";

import warning from "warning";
import { create } from "jss";
import jssPreset from "./jssPreset";
import createMuiTheme from "./createMuiTheme";
import themeListener from "./themeListener";
import createGenerateClassName from "./createGenerateClassName";
import getStylesCreator from "./getStylesCreator";

const ns = { jss: null, sheetOptions: null, sheetsRegistry: null };
const getDisplayName = component => {
  return "style";
};

// Default JSS instance.
const jss = create(jssPreset());

// Use a singleton or the provided one by the context.
const generateClassName = createGenerateClassName();

// Global index counter to preserve source order.
// We create the style sheet during at the creation of the component,
// children are handled after the parents, so the order of style elements would be parent->child.
// It is a problem though when a parent passes a className
// which needs to override any childs styles.
// StyleSheet of the child has a higher specificity, because of the source order.
// So our solution is to render sheets them in the reverse order child->sheet, so
// that parent has a higher specificity.
let indexCounter = Number.MIN_SAFE_INTEGER;

export const sheetsManager = new Map();

// We use the same empty object to ref count the styles that don't need a theme object.
const noopTheme = {};

// In order to have self-supporting components, we rely on default theme when not provided.
let defaultTheme;

function getDefaultTheme() {
  if (defaultTheme) {
    return defaultTheme;
  }

  defaultTheme = createMuiTheme();
  return defaultTheme;
}

const withStyles = (stylesOrCreator, options: any = {}) => {
  const {
    withTheme = false,
    flip = null,
    name,
    ...styleSheetOptions
  } = options;
  debugger;
  const stylesCreator = getStylesCreator(stylesOrCreator);
  const listenToTheme = false;
  // stylesCreator.themingEnabled || withTheme || typeof name === "string";

  indexCounter += 1;
  stylesCreator.options.index = indexCounter;

  warning(
    indexCounter < 0,
    [
      "Material-UI: you might have a memory leak.",
      "The indexCounter is not supposed to grow that much."
    ].join(" ")
  );

  class WithStyles {
    disableStylesGeneration = false;
    jss = null;
    sheetOptions = null;
    sheetsManager = sheetsManager;
    stylesCreatorSaved = null;
    theme = null;
    unsubscribeId = null;

    context = null; //TODO CONTEXT..............

    constructor(props, context) {
      this.jss = this.context[ns.jss] || jss;

      const { muiThemeProviderOptions } = this.context;
      if (muiThemeProviderOptions) {
        if (muiThemeProviderOptions.sheetsManager) {
          this.sheetsManager = muiThemeProviderOptions.sheetsManager;
        }

        this.disableStylesGeneration =
          muiThemeProviderOptions.disableStylesGeneration;
      }

      // Attach the stylesCreator to the instance of the component as in the context
      // of react-hot-loader the hooks can be executed in a different closure context:
      // https://github.com/gaearon/react-hot-loader/blob/master/src/patch.dev.js#L107
      this.stylesCreatorSaved = stylesCreator;
      this.sheetOptions = {
        generateClassName,
        ...this.context[ns.sheetOptions]
      };
      // We use || as the function call is lazy evaluated.
      this.theme = listenToTheme
        ? themeListener.initial(context) || getDefaultTheme()
        : noopTheme;

      this.attach(this.theme);
    }

    attach(theme) {
      if (this.disableStylesGeneration) {
        return;
      }

      const stylesCreatorSaved = this.stylesCreatorSaved;
      let sheetManager = this.sheetsManager.get(stylesCreatorSaved);

      if (!sheetManager) {
        sheetManager = new Map();
        this.sheetsManager.set(stylesCreatorSaved, sheetManager);
      }

      let sheetManagerTheme = sheetManager.get(theme);

      if (!sheetManagerTheme) {
        sheetManagerTheme = {
          refs: 0,
          sheet: null
        };
        sheetManager.set(theme, sheetManagerTheme);
      }

      if (sheetManagerTheme.refs === 0) {
        const styles = stylesCreatorSaved.create(theme, name);
        let meta = name;

        if (process.env.NODE_ENV !== "production" && !meta) {
          meta = getDisplayName(this);
        }

        const sheet = this.jss.createStyleSheet(styles, {
          meta,
          classNamePrefix: meta,
          flip: typeof flip === "boolean" ? flip : theme.direction === "rtl",
          link: false,
          ...this.sheetOptions,
          ...stylesCreatorSaved.options,
          name,
          ...styleSheetOptions
        });

        sheetManagerTheme.sheet = sheet;
        sheet.attach();

        const sheetsRegistry = this.context[ns.sheetsRegistry];
        if (sheetsRegistry) {
          sheetsRegistry.add(sheet);
        }
      }

      sheetManagerTheme.refs += 1;
    }

    detach(theme) {
      if (this.disableStylesGeneration) {
        return;
      }

      const stylesCreatorSaved = this.stylesCreatorSaved;
      const sheetManager = this.sheetsManager.get(stylesCreatorSaved);
      const sheetManagerTheme = sheetManager.get(theme);

      sheetManagerTheme.refs -= 1;

      if (sheetManagerTheme.refs === 0) {
        sheetManager.delete(theme);
        this.jss.removeStyleSheet(sheetManagerTheme.sheet);
        const sheetsRegistry = this.context[ns.sheetsRegistry];
        if (sheetsRegistry) {
          sheetsRegistry.remove(sheetManagerTheme.sheet);
        }
      }
    }
  }

  return WithStyles;
};

export const jssCssRulesWithTheme = (props, styling) => {
  // const styles = styling(fjsx.getContextValue("theme"));

  return withStyles(styling);
};
