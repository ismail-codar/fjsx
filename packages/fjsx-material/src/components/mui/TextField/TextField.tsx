import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import warning from "warning";
import { Input, InputProps, InputComponentProps } from "../Input/Input";
import { InputLabel, InputLabelProps } from "../Input/InputLabel";
import { FormControl } from "../Form/FormControl";
import { FormHelperText } from "../Form/FormHelperText";
import { Select, SelectProps } from "../Select/Select";
import { StandardProps, PropTypes } from "..";
import { FormControlProps } from "../Form/FormControl";
import { FormHelperTextProps } from "../Form/FormHelperText";
import { FormControlClassKey } from "../Form/FormControl";

export interface TextFieldProps
  extends StandardProps<
      FormControlProps,
      TextFieldClassKey,
      "onChange" | "defaultValue"
    > {
  autoComplete?: string;
  autoFocus?: boolean;
  children?: any;
  defaultValue?: string | number;
  disabled$?: boolean;
  error$?: boolean;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  fullWidth?: boolean;
  helperText$?: Element | string;
  id?: string;
  InputLabelProps?: Partial<InputLabelProps>;
  InputProps?: Partial<InputProps>;
  inputProps?: InputProps["inputProps"];
  inputRef?: Fjsx.Ref<any>;
  label?: Element | string;
  margin?: PropTypes.Margin;
  multiline?: boolean;
  name?: string;
  onChange?: Fjsx.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  rows?: string | number;
  rowsMax?: string | number;
  select?: boolean;
  SelectProps?: Partial<SelectProps>;
  type?: string;
  focused$?: boolean;
  value$?: Array<string | number> | string | number;
}

export type TextFieldClassKey = FormControlClassKey;

/**
 * The `TextField` is a convenience wrapper for the most common cases (80%).
 * It cannot be all things to all people, otherwise the API would grow out of control.
 *
 * ## Advanced Configuration
 *
 * It's important to understand that the text field is a simple abstraction
 * on top of the following components:
 * - [FormControl](/api/form-control)
 * - [InputLabel](/api/input-label)
 * - [Input](/api/input)
 * - [FormHelperText](/api/form-helper-text)
 *
 * If you wish to alter the properties applied to the native input, you can do as follow:
 *
 * ```jsx
 * const inputProps = {
 *   step: 300,
 * };
 *
 * return <TextField id="time" type="time" inputProps={inputProps} />;
 * ```
 *
 * For advanced cases, please look at the source of TextField by clicking on the
 * "Edit this page" button above. Consider either:
 * - using the upper case props for passing values direct to the components.
 * - using the underlying components directly as shown in the demos.
 */
export const TextField = (props: TextFieldProps) => {
  fjsx.setDefaults(props, {
    required: false,
    select: false,
    error$: false,
    focused$: false,
    value$: null,
    disabled$: null,
    helperText$: null,
    className$: null
  });
  const {
    autoComplete,
    autoFocus,
    children,
    className$,
    defaultValue,
    error$,
    FormHelperTextProps,
    fullWidth,
    helperText$,
    id,
    InputLabelProps,
    inputProps,
    InputProps,
    inputRef,
    label,
    multiline,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required,
    rows,
    rowsMax,
    select,
    SelectProps,
    type,
    disabled$,
    focused$,
    value$,
    ...other
  } = props;

  warning(
    !select || Boolean(children),
    "Material-UI: `children` must be passed when using the `TextField` component with `select`."
  );

  const helperTextId = helperText$ && id ? `${id}-helper-text` : undefined;

  const inputElementProps: InputComponentProps = {
    autoComplete: autoComplete,
    autoFocus: autoFocus,
    defaultValue: defaultValue,
    disabled: disabled$,
    fullWidth: fullWidth,
    multiline: multiline,
    name: name,
    rows: rows,
    rowsMax: rowsMax,
    type: type,
    value$: value$,
    id: id,
    inputRef: inputRef,
    onBlur: onBlur,
    onChange: onChange,
    onFocus: onFocus,
    placeholder: placeholder,
    inputProps: inputProps,
    focused$: focused$,
    error$: error$,
    ...InputProps
  };

  const handleBlur = () => {};
  const handleClean = () => {};
  const handleDirty = () => {};
  const handleFocus = () => {};

  return (
    <FormControl
      aria-describedby={helperTextId}
      className$={className$}
      error$={error$}
      fullWidth={fullWidth}
      required={required}
      {...other}
    >
      {label && (
        <InputLabel
          htmlFor={id}
          focused$={focused$}
          error$={error$}
          filled$={
            (value$ != null && value$ !== "") || placeholder !== undefined
          }
          disabled$={disabled$}
          required={required}
          {...InputLabelProps}
        >
          {label}
        </InputLabel>
      )}
      {select ? (
        <Select value={value$} input={inputElementProps} {...SelectProps}>
          {children}
        </Select>
      ) : (
        <Input {...inputElementProps} />
      )}
      {helperText$ && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText$}
        </FormHelperText>
      )}
    </FormControl>
  );
};
