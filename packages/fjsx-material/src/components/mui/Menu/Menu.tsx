import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { Popover, PopoverProps, PopoverClassKey } from "../Popover";
import { MenuListProps } from "./MenuList";
import { StandardProps } from "..";

import { MenuList } from "./MenuList";

export interface MenuProps extends StandardProps<PopoverProps, MenuClassKey> {
  anchorEl?: HTMLElement;
  MenuListProps?: Partial<MenuListProps>;
}

export type MenuClassKey = PopoverClassKey | "root";

const RTL_ORIGIN = {
  vertical: "top",
  horizontal: "right"
};

const LTR_ORIGIN = {
  vertical: "top",
  horizontal: "left"
};

export const styles = {
  paper: {
    // specZ: The maximum height of a simple menu should be one or more rows less than the view
    // height. This ensures a tappable area outside of the simple menu with which to dismiss
    // the menu.
    maxHeight: "calc(100vh - 96px)",
    // Add iOS momentum scrolling.
    WebkitOverflowScrolling: "touch"
  }
};

export const Menu = (props: MenuProps) => {
  const {
    children,
    MenuListProps,
    onEnter,
    PaperProps = {},
    PopoverClasses,
    theme,
    ...other
  } = this.props;

  const classes = jssCssRulesWithTheme("MuiMenu", props, styles);
  return (
    <Popover
      getContentAnchorEl={this.getContentAnchorEl}
      classes={PopoverClasses}
      onEnter={this.handleEnter}
      anchorOrigin={theme.direction === "rtl" ? RTL_ORIGIN : LTR_ORIGIN}
      transformOrigin={theme.direction === "rtl" ? RTL_ORIGIN : LTR_ORIGIN}
      PaperProps={{
        ...PaperProps,
        classes: {
          ...PaperProps.classes,
          root: classes.paper
        }
      }}
      {...other}
    >
      <MenuList
        data-mui-test="Menu"
        role="menu"
        onKeyDown={this.handleListKeyDown}
        {...MenuListProps}
        ref={node => {
          this.menuList = node;
        }}
      >
        {children}
      </MenuList>
    </Popover>
  );
};
