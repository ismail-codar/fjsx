import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { StandardProps } from ".";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

export interface ToolbarProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLDivElement>, ToolbarClassKey> {
  disableGutters?: boolean;
}

export type ToolbarClassKey = "root" | "gutters";

export const styles = theme => ({
  root: {
    ...theme.mixins.toolbar,
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  gutters: theme.mixins.gutters()
});

export const Toolbar = (props: ToolbarProps) => {
  fjsx.setDefaults(props, {
    disableGutters: false
  });
  const {
    children,
    className: classNameProp,
    disableGutters,
    ...other
  } = props;

  const classes: any = jssCssRulesWithTheme("MuiToolbar", props, styles);
  const className = classNames(
    classes.root,
    {
      [classes.gutters]: !disableGutters
    },
    classNameProp
  );

  return (
    <div className={className} {...other}>
      {children}
    </div>
  );
};
