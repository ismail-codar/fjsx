import fjsx from "@fjsx/runtime";
import classNames from "classnames";

import { rippleEffect } from "../../utils/ripple-effect";
import { Theme } from "../../styles/createMuiTheme";

import { fade } from "../../styles/colorManipulator";
import { capitalize } from "../../utils/helpers";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

export const buttonBaseStyles = {
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // Remove grey highlight
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "transparent", // Reset default value
    outline: "none",
    border: 0,
    margin: 0, // Remove the margin in Safari
    borderRadius: 0,
    padding: 0, // Remove the padding in Firefox
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    "-moz-appearance": "none", // Reset
    "-webkit-appearance": "none", // Reset
    textDecoration: "none",
    // So we take precedent over the style of a native <a /> element.
    color: "inherit",
    "&::-moz-focus-inner": {
      borderStyle: "none" // Remove Firefox dotted outline.
    },
    "&$disabled": {
      pointerEvents: "none", // Disable link interactions
      cursor: "default"
    }
  },
  disabled: {},
  keyboardFocused: {}
};

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

export const ButtonBase = (props: any) => {
  const {
    buttonRef,
    centerRipple,
    children,
    className: classNameProp,
    component,
    disabled,
    disableRipple,
    focusRipple,
    onBlur,
    onFocus,
    onKeyboardFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    tabIndex,
    TouchRippleProps,
    type,
    ...other
  } = props;

  const classes: any = jssCssRulesWithTheme(
    "MuiButtonBase",
    props,
    buttonBaseStyles
  );

  const className = classNames(
    classes.root,
    {
      [classes.disabled]: disabled
    },
    classNameProp
  );

  const buttonProps: any = {};

  let ComponentProp = component;

  if (!ComponentProp) {
    if (other.href) {
      ComponentProp = "a";
    } else {
      ComponentProp = "button";
    }
  }

  if (ComponentProp === "button") {
    buttonProps.type = type || "button";
    buttonProps.disabled = disabled;
  } else {
    buttonProps.role = "button";
  }

  return (
    <ComponentProp
      // onBlur={this.handleBlur}
      // onFocus={this.handleFocus}
      // onKeyDown={this.handleKeyDown}
      // onKeyUp={this.handleKeyUp}
      // onMouseDown={this.handleMouseDown}
      // onMouseLeave={this.handleMouseLeave}
      // onMouseUp={this.handleMouseUp}
      // onTouchEnd={this.handleTouchEnd}
      // onTouchMove={this.handleTouchMove}
      // onTouchStart={this.handleTouchStart}
      tabIndex={disabled ? "-1" : tabIndex}
      className={className}
      ref={buttonRef}
      {...buttonProps}
      {...other}
    >
      {children}
    </ComponentProp>
  );
};

export const Button = (props: any) => {
  fjsx.setDefaults(props, {
    color: "default",
    disabled: false,
    disableFocusRipple: false,
    fullWidth: false,
    mini: false,
    size: "medium",
    type: "button",
    variant: "flat"
  });
  const classes: any = jssCssRulesWithTheme("MuiButton", props, styles);

  const {
    children,
    className: classNameProp,
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
    classNameProp
  );

  return (
    <ButtonBase className={className} disabled={disabled} {...other}>
      <span className={classes.label}>{children}</span>
    </ButtonBase>
  );
};
