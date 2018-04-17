import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";

export interface ListItemIconProps
  extends StandardProps<{}, ListItemIconClassKey> {
  children?: any;
}

export type ListItemIconClassKey = "root";

export const styles = theme => ({
  root: {
    height: 24,
    marginRight: theme.spacing.unit * 2,
    width: 24,
    color: theme.palette.action.active,
    flexShrink: 0
  }
});

/**
 * A simple wrapper to apply `List` styles to an `Icon` or `SvgIcon`.
 */
export const ListItemIcon = (props: ListItemIconProps) => {
  const { children, className: classNameProp, ...other } = props;

  const classes = jssCssRulesWithTheme("MuiListItemIcon", props, styles);

  const view = fjsx.cloneElement(children[0], {
    [children[0].tagName == "svg" ? "class" : "className"]: classNames(
      classes.root,
      classNameProp,
      children[0].className
    )
    // TODO ...other
  }) as any;
  return view;
};
