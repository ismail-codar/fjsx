import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";

export interface FormLabelProps
  extends StandardProps<FormLabelBaseProps, FormLabelClassKey> {
  component?: Fjsx.DetailedHTMLProps<any, FormLabelBaseProps>;
  disabled?: boolean;
  error?: boolean;
  className$?: any;
  focused$?: boolean;
  required?: boolean;
  muiFormControl?: any;
}

export type FormLabelBaseProps = Fjsx.LabelHTMLAttributes<HTMLLabelElement>;

export type FormLabelClassKey =
  | "root"
  | "focused"
  | "disabled"
  | "error"
  | "asterisk";

export const styles = theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(16),
    lineHeight: 1,
    padding: 0,
    "&$focused": {
      color:
        theme.palette.primary[theme.palette.type === "light" ? "dark" : "light"]
    },
    "&$disabled": {
      color: theme.palette.text.disabled
    },
    "&$error": {
      color: theme.palette.error.main
    }
  },
  focused: {},
  disabled: {},
  error: {},
  asterisk: {
    "&$error": {
      color: theme.palette.error.main
    }
  }
});

export const FormLabel = (props: FormLabelProps) => {
  fjsx.setDefaults(props, {
    component: "label"
  });
  const {
    children,
    component: Component_,
    disabled: disabledProp,
    error: errorProp,
    focused$: focusedProp$,
    required: requiredProp,
    ...other
  } = props;

  // debugger; //TODO context
  const classes = jssCssRulesWithTheme("MuiFormLabel", props, styles);

  let required = requiredProp;
  let focused$ = focusedProp$;
  let disabled = disabledProp;
  let error = errorProp;

  const className$ = classNames(
    classes.root,
    {
      [classes.focused]: focused$,
      [classes.disabled]: disabled,
      [classes.error]: error
    },
    props.className$
  );

  return (
    <Component_ className={className$}>
      {children}
      {required && (
        <span
          className={classNames(classes.asterisk, {
            [classes.error]: error
          })}
          data-mui-test="FormLabelAsterisk"
        >
          {"\u2009*"}
        </span>
      )}
    </Component_>
  );
};
