import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { Textarea } from "./Textarea";

export interface InputProps
  extends StandardProps<
      Fjsx.HTMLAttributes<HTMLDivElement>,
      InputClassKey,
      "onChange" | "onKeyUp" | "onKeyDown" | "defaultValue"
    > {
  autoComplete?: string;
  autoFocus?: boolean;
  defaultValue?: string | number;
  disabled?: boolean;
  disableUnderline?: boolean;
  endAdornment?: Element;
  error?: boolean;
  fullWidth?: boolean;
  id?: string;
  inputComponent?: Fjsx.DetailedHTMLProps<any, InputComponentProps>;
  inputProps?: { [arbitrary: string]: any };
  inputRef?: Fjsx.Ref<any>;
  margin?: "dense";
  multiline?: boolean;
  name?: string;
  placeholder?: string;
  rows?: string | number;
  rowsMax?: string | number;
  startAdornment?: Element;
  type?: string;
  value?: Array<string | number> | string | number;
  /**
   * `onChange`, `onKeyUp` + `onKeyDown` are applied to the inner `InputComponent`,
   * which by default is an input or textarea. Since these handlers differ from the
   * ones inherited by `Fjsx.HTMLAttributes<HTMLDivElement>` we need to omit them.
   *
   * Note that  `blur` and `focus` event handler are applied to the outter `<div>`.
   * So these can just be inherited from the native `<div>`.
   */
  onChange?: Fjsx.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onKeyUp?: Fjsx.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onKeyDown?: Fjsx.KeyboardEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

export interface InputComponentProps extends InputProps {
  // Accommodate arbitrary additional props coming from the `inputProps` prop
  [arbitrary: string]: any;
}

export type InputClassKey =
  | "root"
  | "formControl"
  | "focused"
  | "disabled"
  | "underline"
  | "error"
  | "multiline"
  | "fullWidth"
  | "input"
  | "inputMarginDense"
  | "inputDisabled"
  | "inputMultiline"
  | "inputType"
  | "inputTypeSearch";

// Supports determination of isControlled().
// Controlled input accepts its current value as a prop.
//
// @see https://facebook.github.io/react/docs/forms.html#controlled-components
// @param value
// @returns {boolean} true if string (including '') or number (including zero)
export function hasValue(value) {
  return value != null && !(Array.isArray(value) && value.length === 0);
}

// Determine if field is empty or filled.
// Response determines if label is presented above field or as placeholder.
//
// @param obj
// @param SSR
// @returns {boolean} False when not present or empty string.
//                    True when any number or string with length.
export function isFilled(obj, SSR = false) {
  return (
    obj &&
    ((hasValue(obj.value) && obj.value !== "") ||
      (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ""))
  );
}

// Determine if an Input is adorned on start.
// It's corresponding to the left with LTR.
//
// @param obj
// @returns {boolean} False when no adornments.
//                    True when adorned at the start.
export function isAdornedStart(obj) {
  return obj.startAdornment;
}

export const styles = theme => {
  const light = theme.palette.type === "light";
  const placeholder = {
    color: "currentColor",
    opacity: light ? 0.42 : 0.5,
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shorter
    })
  };
  const placeholderHidden = {
    opacity: 0
  };
  const placeholderVisible = {
    opacity: light ? 0.42 : 0.5
  };
  const bottomLineColor = light
    ? "rgba(0, 0, 0, 0.42)"
    : "rgba(255, 255, 255, 0.7)";

  return {
    root: {
      // Mimics the default input display property used by browsers for an input.
      display: "inline-flex",
      position: "relative",
      fontFamily: theme.typography.fontFamily,
      color: light ? "rgba(0, 0, 0, 0.87)" : theme.palette.common.white,
      fontSize: theme.typography.pxToRem(16),
      lineHeight: "1.1875em", // Reset (19px), match the native input line-height
      "&$disabled": {
        color: theme.palette.text.disabled
      }
    },
    formControl: {
      "label + &": {
        marginTop: theme.spacing.unit * 2
      }
    },
    focused: {},
    disabled: {},
    underline: {
      "&:after": {
        backgroundColor: theme.palette.primary[light ? "dark" : "light"],
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        height: 2,
        position: "absolute",
        right: 0,
        transform: "scaleX(0)",
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut
        }),
        pointerEvents: "none" // Transparent to the hover style.
      },
      "&$focused:after": {
        transform: "scaleX(1)"
      },
      "&$error:after": {
        backgroundColor: theme.palette.error.main,
        transform: "scaleX(1)" // error is always underlined in red
      },
      "&:before": {
        backgroundColor: bottomLineColor,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        height: 1,
        position: "absolute",
        right: 0,
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.shorter
        }),
        pointerEvents: "none" // Transparent to the hover style.
      },
      "&:hover:not($disabled):before": {
        backgroundColor: theme.palette.text.primary,
        height: 2
      },
      "&$disabled:before": {
        background: "transparent",
        backgroundImage: `linear-gradient(to right, ${bottomLineColor} 33%, transparent 0%)`,
        backgroundPosition: "left top",
        backgroundRepeat: "repeat-x",
        backgroundSize: "5px 1px"
      }
    },
    error: {},
    multiline: {
      padding: `${theme.spacing.unit - 2}px 0 ${theme.spacing.unit - 1}px`
    },
    fullWidth: {
      width: "100%"
    },
    input: {
      font: "inherit",
      color: "currentColor",
      padding: `${theme.spacing.unit - 2}px 0 ${theme.spacing.unit - 1}px`,
      border: 0,
      boxSizing: "content-box",
      verticalAlign: "middle",
      background: "none",
      margin: 0, // Reset for Safari
      // Remove grey highlight
      WebkitTapHighlightColor: "transparent",
      display: "block",
      // Make the flex item shrink with Firefox
      minWidth: 0,
      flexGrow: 1,
      "&::-webkit-input-placeholder": placeholder,
      "&::-moz-placeholder": placeholder, // Firefox 19+
      "&:-ms-input-placeholder": placeholder, // IE 11
      "&::-ms-input-placeholder": placeholder, // Edge
      "&:focus": {
        outline: 0
      },
      // Reset Firefox invalid required input style
      "&:invalid": {
        boxShadow: "none"
      },
      "&::-webkit-search-decoration": {
        // Remove the padding when type=search.
        "-webkit-appearance": "none"
      },
      // Show and hide the placeholder logic
      "label[data-shrink=false] + $formControl &": {
        "&::-webkit-input-placeholder": placeholderHidden,
        "&::-moz-placeholder": placeholderHidden, // Firefox 19+
        "&:-ms-input-placeholder": placeholderHidden, // IE 11
        "&::-ms-input-placeholder": placeholderHidden, // Edge
        "&:focus::-webkit-input-placeholder": placeholderVisible,
        "&:focus::-moz-placeholder": placeholderVisible, // Firefox 19+
        "&:focus:-ms-input-placeholder": placeholderVisible, // IE 11
        "&:focus::-ms-input-placeholder": placeholderVisible // Edge
      },
      "&$disabled": {
        opacity: 1 // Reset iOS opacity
      }
    },
    inputMarginDense: {
      paddingTop: theme.spacing.unit / 2 - 1
    },
    inputMultiline: {
      resize: "none",
      padding: 0
    },
    inputType: {
      // type="date" or type="time", etc. have specific styles we need to reset.
      height: "1.1875em" // Reset (19px), match the native input line-height
    },
    inputTypeSearch: {
      // Improve type search style.
      "-moz-appearance": "textfield",
      "-webkit-appearance": "textfield"
    }
  };
};

function formControlState(props) {
  let disabled = props.disabled;
  let error = props.error;
  let margin = props.margin;

  if (props.muiFormControl) {
    if (typeof disabled === "undefined") {
      disabled = props.muiFormControl.disabled;
    }

    if (typeof error === "undefined") {
      error = props.muiFormControl.error;
    }

    if (typeof margin === "undefined") {
      margin = props.muiFormControl.margin;
    }
  }

  return {
    disabled,
    error,
    margin
  };
}

export const Input = (props: InputComponentProps) => {
  fjsx.setDefaults(props, {
    disableUnderline: false,
    fullWidth: false,
    multiline: false,
    type: "text"
  });
  const {
    autoComplete,
    autoFocus,
    className: classNameProp,
    defaultValue,
    disabled: disabledProp,
    disableUnderline,
    endAdornment,
    error: errorProp,
    fullWidth,
    id,
    inputComponent,
    inputProps: { ...inputPropsProp } = {},
    inputRef,
    margin: marginProp,
    multiline,
    name,
    onBlur,
    onChange,
    onEmpty,
    onFilled,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    readOnly,
    rows,
    rowsMax,
    startAdornment,
    type,
    value,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiInput", props, styles);
  // const { muiFormControl } = this.context;
  const { disabled, error, margin } = formControlState(props);

  const className = classNames(
    classes.root,
    {
      [classes.disabled]: disabled,
      [classes.error]: error,
      [classes.fullWidth]: fullWidth,
      // [classes.focused]: this.state.focused,
      // [classes.formControl]: muiFormControl,
      [classes.multiline]: multiline,
      [classes.underline]: !disableUnderline
    },
    classNameProp
  );

  let inputProps = {
    ...inputPropsProp
    // ref: this.handleRefInput
  };

  const inputClassName = classNames(
    classes.input,
    {
      [classes.disabled]: disabled,
      [classes.inputType]: type !== "text",
      [classes.inputTypeSearch]: type === "search",
      [classes.inputMultiline]: multiline,
      [classes.inputMarginDense]: margin === "dense"
    },
    inputProps.className
  );

  // const required = muiFormControl && muiFormControl.required === true;

  let InputComponent: any = "input";

  if (inputComponent) {
    InputComponent = inputComponent;
    inputProps = {
      // Rename ref to inputRef as we don't know the
      // provided `inputComponent` structure.
      inputRef: this.handleRefInput,
      ...inputProps,
      ref: null
    };
  } else if (multiline) {
    if (rows && !rowsMax) {
      InputComponent = "textarea";
    } else {
      inputProps = {
        rowsMax,
        // textareaRef: this.handleRefInput,
        ...inputProps,
        ref: null
      };
      InputComponent = Textarea;
    }
  }

  return (
    <div className={className} {...other}>
      {startAdornment}
      <InputComponent
        aria-invalid={error}
        // aria-required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={inputClassName}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        name={name}
        // onBlur={this.handleBlur}
        // onChange={this.handleChange}
        // onFocus={this.handleFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        placeholder={placeholder || ""}
        readOnly={readOnly}
        // required={required ? true : undefined}
        rows={rows}
        type={type}
        value={value}
        {...inputProps}
      />
      {endAdornment}
    </div>
  );
};
