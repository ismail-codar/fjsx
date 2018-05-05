import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import { StandardProps } from "..";

export interface ListProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLUListElement>, ListClassKey> {
  component?: Fjsx.DetailedHTMLProps<any, ListProps> | string;
  dense?: boolean;
  disablePadding?: boolean;
  subheader?: any;
}

export type ListClassKey = "root" | "padding" | "dense" | "subheader";

export const styles = theme => ({
  root: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "relative"
  },
  padding: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  dense: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2
  },
  subheader: {
    paddingTop: 0
  }
});

export const List = (props: ListProps) => {
  fjsx.setDefaults(props, {
    component: "ul",
    dense: false,
    disablePadding: false,
    className$: null
  });
  const {
    children,
    className$: classNameProp$,
    component: Component,
    dense,
    disablePadding,
    subheader,
    ...other
  } = props;
  const classes = jssCssRulesWithTheme("MuiList", props, styles);
  const className = classNames(
    classes.root,
    {
      [classes.dense]: dense && !disablePadding,
      [classes.padding]: !disablePadding,
      [classes.subheader]: subheader
    },
    classNameProp$
  );

  return (
    <Component className={className} {...other}>
      {subheader}
      {children}
    </Component>
  );
};
