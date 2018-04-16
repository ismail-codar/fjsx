import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { capitalize } from "../../utils/helpers";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

import { StandardProps, PropTypes } from ".";

export interface IconProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLSpanElement>, IconClassKey> {
  color?: PropTypes.Color | "action" | "disabled" | "error";
}

export type IconClassKey =
  | "root"
  | "colorSecondary"
  | "colorAction"
  | "colorDisabled"
  | "colorError"
  | "colorPrimary";

export const styles = theme => ({
  root: {
    userSelect: "none",
    fontSize: 24,
    width: "1em",
    height: "1em",
    // Chrome fix for https://bugs.chromium.org/p/chromium/issues/detail?id=820541
    // To remove at some point.
    overflow: "hidden"
  },
  colorPrimary: {
    color: theme.palette.primary.main
  },
  colorSecondary: {
    color: theme.palette.secondary.main
  },
  colorAction: {
    color: theme.palette.action.active
  },
  colorDisabled: {
    color: theme.palette.action.disabled
  },
  colorError: {
    color: theme.palette.error.main
  }
});

export const Icon = (props: IconProps) => {
  fjsx.setDefaults(props, {
    color: "inherit"
  });
  const { children, className, color, ...other } = props;
  const classes: any = jssCssRulesWithTheme("MuiIcon", props, styles);

  return (
    <span
      className={classNames(
        "material-icons",
        classes.root,
        {
          [classes[`color${capitalize(color)}`]]: color !== "inherit"
        },
        className
      )}
      aria-hidden="true"
      {...other}
    >
      {children}
    </span>
  );
};
