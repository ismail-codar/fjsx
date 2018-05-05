import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { Typography } from "../Typography";

export interface FormControlLabelProps
  extends StandardProps<
      Fjsx.LabelHTMLAttributes<HTMLLabelElement>,
      FormControlLabelClassKey,
      "onChange"
    > {
  checked?: boolean | string;
  control: Element;
  disabled?: boolean;
  inputRef?: Fjsx.Ref<any>;
  label: Element;
  name?: string;
  onChange?: (event: Fjsx.ChangeEvent<{}>, checked: boolean) => void;
  value?: string;
}

export type FormControlLabelClassKey = "root" | "disabled" | "label";

export const styles = theme => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    // For correct alignment with the text.
    verticalAlign: "middle",
    // Remove grey highlight
    WebkitTapHighlightColor: "transparent",
    marginLeft: -14,
    marginRight: theme.spacing.unit * 2, // used for row presentation of radio/checkbox
    "&$disabled": {
      cursor: "default"
    }
  },
  disabled: {},
  label: {
    "&$disabled": {
      color: theme.palette.text.disabled
    }
  }
});

/**
 * Drop in replacement of the `Radio`, `Switch` and `Checkbox` component.
 * Use this component if you want to display an extra label.
 */
export const FormControlLabel = props => {
  const {
    checked,
    classes,
    className: classNameProp$,
    control,
    disabled: disabledProp,
    inputRef,
    label,
    name,
    onChange,
    value,
    ...other
  } = props;

  //TODO context
  debugger;
  const { muiFormControl } = props;
  let disabled = disabledProp;

  if (typeof control.props.disabled !== "undefined") {
    if (typeof disabled === "undefined") {
      disabled = control.props.disabled;
    }
  }

  if (muiFormControl) {
    if (typeof disabled === "undefined") {
      disabled = muiFormControl.disabled;
    }
  }

  const className = classNames(
    classes.root,
    {
      [classes.disabled]: disabled
    },
    classNameProp$
  );

  return (
    <label className={className} {...other}>
      {fjsx.cloneElement(control, {
        disabled,
        checked:
          typeof control.props.checked === "undefined"
            ? checked
            : control.props.checked,
        name: control.props.name || name,
        onChange: control.props.onChange || onChange,
        value: control.props.value || value,
        inputRef: control.props.inputRef || inputRef
      })}
      <Typography
        component="span"
        className$={classNames(classes.label, { [classes.disabled]: disabled })}
      >
        {label}
      </Typography>
    </label>
  );
};
