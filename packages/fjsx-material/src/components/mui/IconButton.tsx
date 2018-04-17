import fjsx from "@fjsx/runtime";
// @inheritedComponent ButtonBase
import classNames from "classnames";
import { PropTypes, StandardProps } from ".";
import { fade } from "../../styles/colorManipulator";
import { capitalize } from "../../utils/helpers";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";
import { ButtonBase, ButtonBaseClassKey, ButtonBaseProps } from "./ButtonBase";

export interface IconButtonProps
  extends StandardProps<ButtonBaseProps, IconButtonClassKey> {
  color?: PropTypes.Color;
  disabled?: boolean;
  disableRipple?: boolean;
}

export type IconButtonClassKey =
  | ButtonBaseClassKey
  | "colorPrimary"
  | "colorSecondary"
  | "colorInherit"
  | "label";

export const styles = theme => ({
  root: {
    textAlign: "center",
    flex: "0 0 auto",
    fontSize: theme.typography.pxToRem(24),
    width: 48,
    height: 48,
    padding: 0,
    borderRadius: "50%",
    color: theme.palette.action.active,
    transition: theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest
    }),
    "&:hover": {
      backgroundColor: fade(theme.palette.action.active, 0.04),
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
  colorInherit: {
    color: "inherit"
  },
  colorPrimary: {
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.04),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  },
  colorSecondary: {
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: fade(theme.palette.secondary.main, 0.04),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  },
  disabled: {},
  label: {
    width: "100%",
    display: "flex",
    alignItems: "inherit",
    justifyContent: "inherit"
  }
});

/**
 * Refer to the [Icons](/style/icons) section of the documentation
 * regarding the available icon options.
 */
export const IconButton = (props: IconButtonProps) => {
  fjsx.setDefaults(props, {
    color: "default",
    disabled: false
  });
  const { children, className, color, disabled, ...other } = props;
  const classes: any = jssCssRulesWithTheme("MuiIconButton", props, styles);

  return (
    <ButtonBase
      className={classNames(
        classes.root,
        {
          [classes[`color${capitalize(color)}`]]: color !== "default",
          [classes.disabled]: disabled
        },
        className
      )}
      centerRipple
      focusRipple
      disabled={disabled}
      {...other}
    >
      <span className={classes.label}>{children}</span>
    </ButtonBase>
  );
};
