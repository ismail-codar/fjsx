import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";
import { fade } from "../../styles/colorManipulator";

import { StandardProps } from ".";

export interface DividerProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLHRElement>, DividerClassKey> {
  absolute?: boolean;
  component?: Fjsx.DetailedHTMLProps<any, DividerProps>;
  inset?: boolean;
  light?: boolean;
}

export type DividerClassKey = "root" | "absolute" | "inset" | "light";

export const styles = theme => ({
  root: {
    height: 1,
    margin: 0, // Reset browser default style.
    border: "none",
    flexShrink: 0,
    backgroundColor: theme.palette.divider
  },
  absolute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%"
  },
  inset: {
    marginLeft: theme.spacing.unit * 9
  },
  light: {
    backgroundColor: fade(theme.palette.divider, 0.08)
  }
});

export const Divider = (props: DividerProps) => {
  fjsx.setDefaults(props, {
    absolute: false,
    component: "hr",
    inset: false,
    light: false,
    className$: null
  });
  const {
    absolute,
    className$: classNameProp$,
    inset,
    light,
    ...other
  } = props;
  const classes = jssCssRulesWithTheme("MuiDivider", props, styles);
  const className = classNames(
    classes.root,
    {
      [classes.absolute]: absolute,
      [classes.inset]: inset,
      [classes.light]: light
    },
    classNameProp$
  );

  const Component = props.component;
  return <Component className={className} {...other} />;
};
