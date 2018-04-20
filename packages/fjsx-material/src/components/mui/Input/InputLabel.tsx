import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import { StandardProps } from "..";
import { FormLabel } from "../Form/FormLabel";
import { FormLabelProps, FormLabelClassKey } from "../Form/FormLabel";

export interface InputLabelProps
  extends StandardProps<FormLabelProps, InputLabelClassKey> {
  disableAnimation?: boolean;
  disabled?: boolean;
  error?: boolean;
  FormLabelClasses?: any; //Partial<ClassNameMap<FormLabelClassKey>>;
  focused$?: boolean;
  required?: boolean;
  shrink$?: boolean;
}

export type InputLabelClassKey =
  | FormLabelClassKey
  | "formControl"
  | "marginDense"
  | "shrink"
  | "animated";

export const styles = theme => ({
  root: {
    transformOrigin: "top left"
  },
  formControl: {
    position: "absolute",
    left: 0,
    top: 0,
    // slight alteration to spec spacing to match visual spec result
    transform: `translate(0, ${theme.spacing.unit * 3}px) scale(1)`
  },
  marginDense: {
    // Compensation for the `Input.inputDense` style.
    transform: `translate(0, ${theme.spacing.unit * 2.5 + 1}px) scale(1)`
  },
  shrink: {
    transform: "translate(0, 1.5px) scale(0.75)",
    transformOrigin: "top left"
  },
  animated: {
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut
    })
  }
});

export const InputLabel = props => {
  fjsx.setDefaults(props, {
    disableAnimation: false
  });
  const filled$ = false; //TODO

  const {
    children,
    className: classNameProp,
    disableAnimation,
    FormLabelClasses,
    margin: marginProp,
    focused$,
    shrink$: shrinkProp,
    adornedStart,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiInputLabel", props, styles);
  let shrink$ = shrinkProp;

  if (shrink$ === undefined) {
    shrink$ = filled$ || focused$ || adornedStart;
  }

  let margin = marginProp;

  const className$ = classNames(
    classes.root,
    {
      [classes.formControl]: !focused$,
      [classes.animated]: !disableAnimation,
      [classes.shrink]: shrink$,
      [classes.marginDense]: margin === "dense"
    },
    classNameProp
  );

  return (
    <FormLabel className$={className$} classes={FormLabelClasses}>
      {children}
    </FormLabel>
  );
};
