import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import warning from "warning";
import { Input, InputProps } from "../Input/Input";
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
  children?: Element;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: boolean;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  fullWidth?: boolean;
  helperText?: Element;
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
  value?: Array<string | number> | string | number;
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
    focused$: false
  });
  const {
    autoComplete,
    autoFocus,
    children,
    className,
    defaultValue,
    disabled,
    error,
    FormHelperTextProps,
    fullWidth,
    helperText,
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
    focused$: focusedProp$,
    value,
    ...other
  } = props;

  let focused$ = focusedProp$;

  warning(
    !select || Boolean(children),
    "Material-UI: `children` must be passed when using the `TextField` component with `select`."
  );

  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const InputElement = (
    <Input
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      name={name}
      rows={rows}
      rowsMax={rowsMax}
      type={type}
      value={value}
      id={id}
      inputRef={inputRef}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      inputProps={inputProps}
      focused$={focused$}
      {...InputProps}
    />
  );

  const handleBlur = () => {};
  const handleClean = () => {};
  const handleDirty = () => {};
  const handleFocus = () => {};

  return (
    <FormControl
      aria-describedby={helperTextId}
      className={className}
      error={error}
      fullWidth={fullWidth}
      required={required}
      {...other}
    >
      {label && (
        <InputLabel htmlFor={id} focused$={focused$} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      {select ? (
        <Select value={value} input={InputElement} {...SelectProps}>
          {children}
        </Select>
      ) : (
        InputElement
      )}
      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
