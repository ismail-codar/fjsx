import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { capitalize } from "../../../utils/helpers";

export interface ListSubheaderProps
  extends StandardProps<
      Fjsx.HTMLAttributes<HTMLDivElement>,
      ListSubheaderClassKey
    > {
  component?: Fjsx.DetailedHTMLProps<any, ListSubheaderProps>;
  color?: "default" | "primary" | "inherit";
  inset?: boolean;
  disableSticky?: boolean;
}

export type ListSubheaderClassKey =
  | "root"
  | "colorPrimary"
  | "colorInherit"
  | "inset"
  | "sticky";

export const styles = theme => ({
  root: theme.mixins.gutters({
    boxSizing: "border-box",
    lineHeight: "48px",
    listStyle: "none",
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(14)
  }),
  colorPrimary: {
    color: theme.palette.primary.main
  },
  colorInherit: {
    color: "inherit"
  },
  inset: {
    paddingLeft: theme.spacing.unit * 9
  },
  sticky: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "inherit"
  }
});

export const ListSubheader = (props: ListSubheaderProps) => {
  fjsx.setDefaults(props, {
    color: "default",
    component: "li",
    disableSticky: false,
    inset: false,
    className$: null
  });
  const {
    className$,
    color,
    component: Component,
    disableSticky,
    inset,
    ...other
  } = props;
  const classes = jssCssRulesWithTheme("MuiListSubheader", props, styles);
  return (
    <Component
      className={classNames(
        classes.root,
        {
          [classes[`color${capitalize(color)}`]]: color !== "default",
          [classes.inset]: inset,
          [classes.sticky]: !disableSticky
        },
        className$
      )}
      {...other}
    />
  );
};
