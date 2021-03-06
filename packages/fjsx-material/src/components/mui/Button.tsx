import fjsx from "@fjsx/runtime";
import classNames from "classnames";

import { Theme } from "../../styles/createMuiTheme";

import { fade } from "../../styles/colorManipulator";
import { capitalize } from "../../utils/helpers";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";
import { ButtonBase } from "./ButtonBase";

import { ButtonBaseProps, ButtonBaseClassKey } from "./ButtonBase";
import { StandardProps, PropTypes } from ".";

export interface ButtonProps
  extends StandardProps<ButtonBaseProps, ButtonClassKey, "component"> {
  color?: PropTypes.Color;
  component?: Fjsx.DetailedHTMLProps<any, ButtonProps>;
  disabled?: boolean;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  fullWidth?: boolean;
  href?: string;
  mini?: boolean;
  size?: "small" | "medium" | "large";
  type?: string;
  variant?: "flat" | "raised" | "fab";
}

export type ButtonClassKey =
  | ButtonBaseClassKey
  | "label"
  | "flatPrimary"
  | "flatSecondary"
  | "colorInherit"
  | "raised"
  | "keyboardFocused"
  | "raisedPrimary"
  | "raisedSecondary"
  | "disabled"
  | "fab"
  | "mini"
  | "sizeSmall"
  | "sizeLarge"
  | "fullWidth";

export const styles = theme => ({
  root: {
    ...theme.typography.button,
    lineHeight: "1.4em", // Improve readability for multiline button.
    boxSizing: "border-box",
    minWidth: theme.spacing.unit * 11,
    minHeight: 36,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    borderRadius: 2,
    color: theme.palette.text.primary,
    transition: theme.transitions.create(["background-color", "box-shadow"], {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      textDecoration: "none",
      backgroundColor: fade(theme.palette.text.primary, 0.12),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      },
      "&$disabled": {
        backgroundColor: "transparent"
      }
    },
    "&$disabled": {
      color: theme.palette.action.disabled
    }
  },
  label: {
    width: "100%",
    display: "inherit",
    alignItems: "inherit",
    justifyContent: "inherit"
  },
  flatPrimary: {
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.12),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  },
  flatSecondary: {
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: fade(theme.palette.secondary.main, 0.12),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  },
  colorInherit: {
    color: "inherit"
  },
  raised: {
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    backgroundColor: theme.palette.grey[300],
    boxShadow: theme.shadows[2],
    "&$keyboardFocused": {
      boxShadow: theme.shadows[6]
    },
    "&:active": {
      boxShadow: theme.shadows[8]
    },
    "&$disabled": {
      color: theme.palette.action.disabled,
      boxShadow: theme.shadows[0],
      backgroundColor: theme.palette.action.disabledBackground
    },
    "&:hover": {
      backgroundColor: theme.palette.grey.A100,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.palette.grey[300]
      },
      "&$disabled": {
        backgroundColor: theme.palette.action.disabledBackground
      }
    }
  },
  raisedPrimary: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.palette.primary.main
      }
    }
  },
  raisedSecondary: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: theme.palette.secondary.main
      }
    }
  },
  keyboardFocused: {},
  disabled: {},
  fab: {
    borderRadius: "50%",
    padding: 0,
    minWidth: 0,
    width: 56,
    fontSize: 24,
    height: 56,
    boxShadow: theme.shadows[6],
    "&:active": {
      boxShadow: theme.shadows[12]
    }
  },
  mini: {
    width: 40,
    height: 40
  },
  sizeSmall: {
    padding: `${theme.spacing.unit - 1}px ${theme.spacing.unit}px`,
    minWidth: theme.spacing.unit * 8,
    minHeight: 32,
    fontSize: theme.typography.pxToRem(13)
  },
  sizeLarge: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    minWidth: theme.spacing.unit * 14,
    minHeight: 40,
    fontSize: theme.typography.pxToRem(15)
  },
  fullWidth: {
    width: "100%"
  }
});

export const Button = (props: ButtonProps) => {
  fjsx.setDefaults(props, {
    color: "default",
    disabled: false,
    disableFocusRipple: false,
    fullWidth: false,
    mini: false,
    size: "medium",
    type: "button",
    variant: "flat",
    className$: null
  });
  const classes: any = jssCssRulesWithTheme("MuiButton", props, styles);

  const {
    children,
    className$: classNameProp$,
    color,
    disabled,
    disableFocusRipple,
    fullWidth,
    mini,
    size,
    variant,
    ...other
  } = props;

  const fab = variant === "fab";
  const raised = variant === "raised";
  const flat = !raised && !fab;
  const className = classNames(
    classes.root,
    {
      [classes.raised]: raised || fab,
      [classes.fab]: fab,
      [classes.mini]: fab && mini,
      [classes.colorInherit]: color === "inherit",
      [classes.flatPrimary]: flat && color === "primary",
      [classes.flatSecondary]: flat && color === "secondary",
      [classes.raisedPrimary]: !flat && color === "primary",
      [classes.raisedSecondary]: !flat && color === "secondary",
      [classes[`size${capitalize(size)}`]]: size !== "medium",
      [classes.disabled]: disabled,
      [classes.fullWidth]: fullWidth
    },
    classNameProp$
  );

  return (
    <ButtonBase className$={className} disabled={disabled} {...other}>
      <span className={classes.label}>{children}</span>
    </ButtonBase>
  );
};
