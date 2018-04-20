import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { ListProps, ListClassKey, List } from "../List/List";

export interface MenuListProps
  extends StandardProps<ListProps, MenuListClassKey, "onKeyDown"> {
  onKeyDown?: Fjsx.FjsxEventHandler<Fjsx.KeyboardEvent<any>>;
  children: any[];
}

export type MenuListClassKey = ListClassKey;

export const MenuList = (props: MenuListProps) => {
  const { children, className, onBlur, onKeyDown, ...other } = this.props;

  return (
    <List
      data-mui-test="MenuList"
      role="menu"
      ref={node => {
        this.list = node;
      }}
      className={className}
      onKeyDown={this.handleKeyDown}
      onBlur={this.handleBlur}
      {...other}
    >
      {props.children.map((child, index) => {
        return fjsx.cloneElement(child, {
          tabIndex: index === this.state.currentTabIndex ? 0 : -1,
          ref: child.props.selected
            ? node => {
                this.selectedItem = node;
              }
            : undefined,
          onFocus: this.handleItemFocus
        });
      })}
    </List>
  );
};
