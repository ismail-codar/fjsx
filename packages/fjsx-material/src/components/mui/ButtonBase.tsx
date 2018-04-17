import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";
import classNames from "classnames";
import { rippleEffect } from "../../utils/ripple-effect";
import { StandardProps } from "./index";

export interface ButtonBaseProps
  extends StandardProps<
      Fjsx.AnchorHTMLAttributes<HTMLElement> &
        Fjsx.ButtonHTMLAttributes<HTMLElement>,
      ButtonBaseClassKey
    > {
  buttonRef?: Fjsx.Ref<any>;
  centerRipple?: boolean;
  component?: Fjsx.DetailedHTMLProps<any, ButtonBaseProps>;
  disableRipple?: boolean;
  focusRipple?: boolean;
  onKeyboardFocus?: Fjsx.FocusEventHandler<any>;
}

export type ButtonBaseClassKey = "root" | "disabled" | "keyboardFocused";

export const styles = {
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

export const ButtonBase = (props: ButtonBaseProps) => {
  const {
    buttonRef,
    children,
    className: classNameProp,
    component,
    disabled,
    tabIndex,
    disableRipple,
    type,
    ...other
  } = props;

  const classes: any = jssCssRulesWithTheme("MuiButtonBase", props, styles);

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
      tabIndex={disabled ? "-1" : tabIndex}
      className={className}
      ref={element => {
        if (!disableRipple) rippleEffect(element);
        buttonRef && buttonRef(element);
      }}
      {...buttonProps}
      {...other}
    >
      {children}
    </ComponentProp>
  );
};
