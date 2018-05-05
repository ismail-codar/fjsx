import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";
import { capitalize } from "../../utils/helpers";

import { PropTypes, StandardProps } from ".";
import { PaperProps, PaperClassKey, Paper } from "./Paper";

export interface AppBarProps extends StandardProps<PaperProps, AppBarClassKey> {
  color?: PropTypes.Color;
  position?: "fixed" | "absolute" | "sticky" | "static";
}

export type AppBarClassKey =
  | PaperClassKey
  | "positionFixed"
  | "positionAbsolute"
  | "positionSticky"
  | "positionStatic"
  | "colorDefault"
  | "colorPrimary"
  | "colorSecondary";

export const styles = theme => {
  const backgroundColorDefault =
    theme.palette.type === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[900];

  return {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      boxSizing: "border-box", // Prevent padding issue with the Modal and fixed positioned AppBar.
      zIndex: theme.zIndex.appBar,
      flexShrink: 0
    },
    positionFixed: {
      position: "fixed",
      top: 0,
      left: "auto",
      right: 0
    },
    positionAbsolute: {
      position: "absolute",
      top: 0,
      left: "auto",
      right: 0
    },
    positionSticky: {
      position: "sticky",
      top: 0,
      left: "auto",
      right: 0
    },
    positionStatic: {
      position: "static"
    },
    colorDefault: {
      backgroundColor: backgroundColorDefault,
      color: theme.palette.getContrastText(backgroundColorDefault)
    },
    colorPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },
    colorSecondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText
    }
  };
};

export const AppBar = (props: AppBarProps) => {
  fjsx.setDefaults(props, {
    color: "primary",
    position: "fixed"
  });
  const {
    children,
    className: classNameProp,
    color,
    position,
    ...other
  } = props;

  console.log(classNameProp);

  const classes = jssCssRulesWithTheme("MuiAppBar", props, styles);
  const className = classNames(
    classes.root,
    classes[`position${capitalize(position)}`],
    {
      [classes[`color${capitalize(color)}`]]: color !== "inherit",
      "mui-fixed": position === "fixed" // Useful for the Dialog
    },
    classNameProp
  );

  return (
    <Paper
      square
      component="header"
      elevation={4}
      className={className}
      {...other}
    >
      {children}
    </Paper>
  );
};
