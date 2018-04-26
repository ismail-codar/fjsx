import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import { StandardProps } from "..";

export interface FormHelperTextProps
  extends StandardProps<
      Fjsx.HTMLAttributes<HTMLParagraphElement>,
      FormHelperTextClassKey
    > {
  disabled$?: boolean;
  error$?: boolean;
  component?: Element | string;
  margin?: "dense";
}

export type FormHelperTextClassKey =
  | "root"
  | "error"
  | "disabled"
  | "marginDense";

export const styles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(12),
    textAlign: "left",
    marginTop: theme.spacing.unit,
    lineHeight: "1em",
    minHeight: "1em",
    margin: 0,
    "&$error": {
      color: theme.palette.error.main
    },
    "&$disabled": {
      color: theme.palette.text.disabled
    }
  },
  error: {},
  disabled: {},
  marginDense: {
    marginTop: theme.spacing.unit / 2
  }
});

export const FormHelperText = props => {
  fjsx.setDefaults(props, {
    component: "p",
    disabled$: false,
    error$: false
  });
  const {
    className: classNameProp,
    disabled$,
    error$,
    margin,
    component: Component,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiFormHelperText", props, styles);

  const className = classNames(
    classes.root,
    {
      [classes.disabled]: disabled$,
      [classes.error]: error$,
      [classes.marginDense]: margin === "dense"
    },
    classNameProp
  );

  return <Component className={className} {...other} />;
};
