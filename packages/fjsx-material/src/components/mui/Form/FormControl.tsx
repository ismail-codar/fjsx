import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import { isFilled, isAdornedStart } from "../Input/Input";
import { capitalize } from "../../../utils/helpers";
import { StandardProps, PropTypes } from "..";

export interface FormControlProps
  extends StandardProps<
      Fjsx.HtmlHTMLAttributes<HTMLDivElement>,
      FormControlClassKey
    > {
  component?: Fjsx.DetailedHTMLProps<any, any>;
  disabled?: boolean;
  error$?: boolean;
  fullWidth?: boolean;
  margin?: PropTypes.Margin;
  onBlur?: Fjsx.EventHandler<any>;
  onFocus?: Fjsx.EventHandler<any>;
  required?: boolean;
}

export type FormControlClassKey =
  | "root"
  | "marginNormal"
  | "marginDense"
  | "fullWidth";

export const styles = theme => ({
  root: {
    display: "inline-flex",
    flexDirection: "column",
    position: "relative",
    // Reset fieldset default style
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0
  },
  marginNormal: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit
  },
  marginDense: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit / 2
  },
  fullWidth: {
    width: "100%"
  }
});

/**
 * Provides context such as filled/focused/error/required for form inputs.
 * Relying on the context provides high flexibilty and ensures that the state always stay
 * consitent across the children of the `FormControl`.
 * This context is used by the following components:
 *  - FormLabel
 *  - FormHelperText
 *  - Input
 *  - InputLabel
 */
export const FormControl = (props: FormControlProps) => {
  fjsx.setDefaults(props, {
    component: "div",
    disabled: false,
    error$: false,
    fullWidth: false,
    margin: "none",
    required: false
  });
  const {
    className,
    disabled,
    error$,
    fullWidth,
    margin,
    required,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiFormControl", props, styles);
  const Component = props.component;
  return (
    <Component
      className={classNames(
        classes.root,
        {
          [classes[`margin${capitalize(margin)}`]]: margin !== "none",
          [classes.fullWidth]: fullWidth
        },
        className
      )}
      {...other}
      // onFocus={props.handleFocus}
      // onBlur={props.handleBlur}
    />
  );
};
