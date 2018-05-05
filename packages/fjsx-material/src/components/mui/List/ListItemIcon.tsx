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
  fjsx.setDefaults(props, { className$: null });
  const { children, className$: classNameProp$, ...other } = props;

  const classes = jssCssRulesWithTheme("MuiListItemIcon", props, styles);

  const view = children[0].cloneNode(true);
  view[children[0].tagName == "svg" ? "class" : "className"] = classNames(
    classes.root,
    classNameProp$,
    children[0].className
  );
};
