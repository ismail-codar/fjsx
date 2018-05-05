import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { capitalize } from "../../utils/helpers";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";
import { StandardProps, PropTypes } from ".";

export interface SvgIconProps
  extends StandardProps<Fjsx.SVGProps<SVGSVGElement>, SvgIconClassKey> {
  color?: PropTypes.Color | "action" | "disabled" | "error";
  nativeColor?: string;
  titleAccess?: string;
  viewBox?: string;
}

export type SvgIconClassKey =
  | "root"
  | "colorSecondary"
  | "colorAction"
  | "colorDisabled"
  | "colorError"
  | "colorPrimary";

export const styles = theme => ({
  root: {
    userSelect: "none",
    fontSize: 24,
    width: "1em",
    height: "1em",
    display: "inline-block",
    fill: "currentColor",
    flexShrink: 0,
    transition: theme.transitions.create("fill", {
      duration: theme.transitions.duration.shorter
    })
  },
  colorPrimary: {
    color: theme.palette.primary.main
  },
  colorSecondary: {
    color: theme.palette.secondary.main
  },
  colorAction: {
    color: theme.palette.action.active
  },
  colorDisabled: {
    color: theme.palette.action.disabled
  },
  colorError: {
    color: theme.palette.error.main
  }
});

export const SvgIcon = (props: SvgIconProps) => {
  fjsx.setDefaults(props, {
    color: "inherit",
    viewBox: "0 0 24 24",
    className$: null
  });
  const {
    children,
    className$: classNameProp$,
    color,
    nativeColor,
    titleAccess,
    viewBox,
    ...other
  } = props;
  const classes: any = jssCssRulesWithTheme("MuiSvgIcon", props, styles);

  const className = classNames(
    classes.root,
    {
      [classes[`color${capitalize(color)}`]]: color !== "inherit"
    },
    classNameProp$
  );

  return (
    <svg
      className={className}
      focusable="false"
      viewBox={viewBox}
      color={nativeColor}
      aria-hidden={titleAccess ? "false" : "true"}
      {...other}
    >
      {titleAccess ? <title>{titleAccess}</title> : null}
      {children}
    </svg>
  );
};
