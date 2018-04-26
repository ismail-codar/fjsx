import { StandardProps } from "..";
import { MenuProps, Menu } from "../Menu/Menu";
import warning from "warning";
import classNames from "classnames";
import { ArrowDropDown } from "../internal/svg-icons/ArrowDropDown";
import { isFilled } from "../Input/Input";

export interface SelectInputProps
  extends StandardProps<{}, SelectInputClassKey> {
  children?: any;
  autoFocus?: boolean;
  autoWidth: boolean;
  disabled?: boolean;
  inputRef?: (
    ref:
      | HTMLSelectElement
      | { node: HTMLInputElement; value: SelectInputProps["value"] }
  ) => void;
  MenuProps?: Partial<MenuProps>;
  multiple: boolean;
  name?: string;
  native: boolean;
  onBlur?: Fjsx.FocusEventHandler<any>;
  onChange?: (event: Fjsx.ChangeEvent<{}>, child: any) => void;
  onClose?: (event: Fjsx.ChangeEvent<{}>) => void;
  onFocus?: Fjsx.FocusEventHandler<any>;
  onOpen?: (event: Fjsx.ChangeEvent<{}>) => void;
  open?: boolean;
  readOnly?: boolean;
  renderValue?: (value: SelectInputProps["value"]) => any;
  SelectDisplayProps?: Fjsx.HTMLAttributes<HTMLDivElement>;
  tabIndex?: number;
  value?: string | number | Array<string | number>;
  displayEmpty?: boolean;
  type?: string;
}

export type SelectInputClassKey =
  | "root"
  | "select"
  | "selectMenu"
  | "disabled"
  | "icon";

export const SelectInput = (props: SelectInputProps) => {
  const {
    autoWidth,
    children,
    classes,
    className: classNameProp,
    disabled,
    displayEmpty,
    inputRef,
    MenuProps = {},
    multiple,
    name,
    native,
    onBlur,
    onChange,
    onClose,
    onFocus,
    onOpen,
    open: openProp,
    readOnly,
    renderValue,
    SelectDisplayProps,
    tabIndex: tabIndexProp,
    type = "hidden",
    value,
    ...other
  } = props;

  let displayWidth: number = null;
  let displayNode: HTMLElement = null;
  const handleDisplayRef = element => {
    displayNode = element;
  };
  const handleSelectRef = element => {};
  const handleKeyDown = e => {};
  const handleBlur = e => {};
  const handleClick = e => {};
  const handleClose = e => {};

  const open = props.open !== undefined && displayNode ? openProp : props.open;

  if (native) {
    warning(
      multiple === false,
      "Material-UI: you can not use the `native={true}` and `multiple={true}` properties " +
        "at the same time on a `Select` component."
    );
    warning(
      !renderValue,
      "Material-UI: the `renderValue` property is not used by the native implementation."
    );
    warning(
      !displayEmpty,
      "Material-UI: the `displayEmpty` property is not used by the native implementation."
    );

    return (
      <div className={classes.root}>
        <select
          className={classNames(
            classes.select,
            {
              [classes.disabled]: disabled
            },
            classNameProp
          )}
          name={name}
          disabled={disabled}
          onBlur={onBlur}
          onChange={onChange as any}
          onFocus={onFocus as any}
          value={value as any}
          ref={inputRef as any}
          {...other}
        >
          {children}
        </select>
        <ArrowDropDown className={classes.icon} />
      </div>
    );
  }

  let display;
  let displaySingle = "";
  const displayMultiple = [];
  let computeDisplay = false;

  // No need to display any value if the field is empty.
  if (isFilled(props) || displayEmpty) {
    if (renderValue) {
      display = renderValue(value);
    } else {
      computeDisplay = true;
    }
  }

  const items = children.map(child => {
    let selected;

    if (multiple) {
      if (!Array.isArray(value)) {
        throw new Error(
          "Material-UI: the `value` property must be an array " +
            "when using the `Select` component with `multiple`."
        );
      }

      selected = value.indexOf(child.props.value) !== -1;
      if (selected && computeDisplay) {
        displayMultiple.push(child.props.children);
      }
    } else {
      selected = value === child.props.value;
      if (selected && computeDisplay) {
        displaySingle = child.props.children;
      }
    }

    debugger;
    return null;
    /*
    return fjsx.cloneElement(child, {
      onClick: handleItemClick(child),
      role: "option",
      selected,
      value: undefined, // The value is most likely not a valid HTML attribute.
      "data-value": child.props.value // Instead, we provide it as a data attribute.
    });
    */
  });

  if (computeDisplay) {
    display = multiple ? displayMultiple.join(", ") : displaySingle;
  }

  const MenuMinWidth = displayNode && !autoWidth ? displayWidth : undefined;

  let tabIndex;
  if (typeof tabIndexProp !== "undefined") {
    tabIndex = tabIndexProp;
  } else {
    tabIndex = disabled ? null : 0;
  }

  return (
    <div className={classes.root}>
      <div
        className={classNames(
          classes.select,
          classes.selectMenu,
          {
            [classes.disabled]: disabled
          },
          classNameProp
        )}
        ref={handleDisplayRef}
        data-mui-test="SelectDisplay"
        aria-pressed={open ? "true" : "false"}
        tabIndex={tabIndex}
        role="button"
        aria-owns={open ? `menu-${name || ""}` : null}
        aria-haspopup="true"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={disabled || readOnly ? null : handleClick}
        onFocus={onFocus}
        {...SelectDisplayProps}
      >
        {/* So the vertical align positioning algorithm quicks in. */}
        {/* eslint-disable-next-line react/no-danger */}
        {display || <span dangerouslySetInnerHTML={{ __html: "&#8203" }} />}
      </div>
      <input
        value={Array.isArray(value) ? value.join(",") : value}
        name={name}
        readOnly={readOnly}
        ref={handleSelectRef}
        type={type}
        {...other}
      />
      <ArrowDropDown className={classes.icon} />
      <Menu
        id={`menu-${name || ""}`}
        anchorEl={displayNode}
        open={open}
        onClose={handleClose}
        {...MenuProps}
        MenuListProps={{
          role: "listbox",
          ...MenuProps.MenuListProps
        }}
        PaperProps={{
          ...MenuProps.PaperProps,
          style: {
            minWidth: MenuMinWidth,
            ...(MenuProps.PaperProps != null
              ? MenuProps.PaperProps.style
              : null)
          }
        }}
      >
        {items}
      </Menu>
    </div>
  );
};
