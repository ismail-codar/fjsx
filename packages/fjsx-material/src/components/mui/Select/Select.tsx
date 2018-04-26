import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { Input, InputProps, InputComponentProps } from "../Input/Input";
import { MenuProps } from "../Menu/Menu";

export interface SelectProps extends StandardProps<InputProps, SelectClassKey> {
  autoWidth?: boolean;
  displayEmpty?: boolean;
  input?: InputComponentProps;
  MenuProps?: Partial<MenuProps>;
  multiple?: boolean;
  native?: boolean;
  onClose?: (event: Fjsx.ChangeEvent<{}>) => void;
  onOpen?: (event: Fjsx.ChangeEvent<{}>) => void;
  open?: boolean;
  renderValue?: (value: SelectProps["value"]) => Element;
  SelectDisplayProps?: Fjsx.HTMLAttributes<HTMLDivElement>;
  value?: Array<string | number> | string | number;
}

export type SelectClassKey =
  | "root"
  | "select"
  | "selectMenu"
  | "disabled"
  | "icon";

import { SelectInput, SelectInputProps } from "./SelectInput";

export const styles = theme => ({
  root: {
    position: "relative",
    width: "100%"
  },
  select: {
    "-moz-appearance": "none", // Reset
    "-webkit-appearance": "none", // Reset
    // When interacting quickly, the text can end up selected.
    // Native select can't be selected either.
    userSelect: "none",
    paddingRight: theme.spacing.unit * 4,
    width: `calc(100% - ${theme.spacing.unit * 4}px)`,
    minWidth: theme.spacing.unit * 2, // So it doesn't collapse.
    cursor: "pointer",
    "&:focus": {
      // Show that it's not an text input
      background:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.05)"
          : "rgba(255, 255, 255, 0.05)",
      borderRadius: 0 // Reset Chrome style
    },
    // Remove Firefox focus border
    "&:-moz-focusring": {
      color: "transparent",
      textShadow: "0 0 0 #000"
    },
    // Remove IE11 arrow
    "&::-ms-expand": {
      display: "none"
    },
    "&$disabled": {
      cursor: "default"
    }
  },
  selectMenu: {
    width: "auto", // Fix Safari textOverflow
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    minHeight: "1.1875em" // Reset (19px), match the native input line-height
  },
  disabled: {},
  icon: {
    // We use a position absolute over a flexbox in order to forward the pointer events
    // to the input.
    position: "absolute",
    right: 0,
    top: "calc(50% - 12px)", // Center vertically
    color: theme.palette.action.active,
    "pointer-events": "none" // Don't block pointer events on the select under the icon.
  }
});

export const Select = (props: SelectProps) => {
  fjsx.setDefaults(props, {
    autoWidth: false,
    displayEmpty: false,
    multiple: false,
    native: false
  });

  const {
    autoWidth,
    children,
    displayEmpty,
    input,
    inputProps,
    MenuProps,
    multiple,
    native,
    onClose,
    onOpen,
    open,
    renderValue,
    SelectDisplayProps,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiSelect", props, styles);

  const inputComponentProps: InputComponentProps = Object.assign({}, input, {
    // Most of the logic is implemented in `SelectInput`.
    // The `Select` component is a simple API wrapper to expose something better to play with.
    inputComponent: SelectInput,
    inputProps: {
      autoWidth,
      children,
      classes,
      displayEmpty,
      MenuProps,
      multiple,
      native,
      onClose,
      onOpen,
      open,
      renderValue,
      SelectDisplayProps,
      type: undefined, // We render a select. We can ignore the type provided by the `Input`.
      ...inputProps,
      ...(input ? input.inputProps : {})
    },
    ...other
  });

  return <Input {...inputComponentProps} />;
};
