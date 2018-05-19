import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import warning from "warning";
import { StandardProps } from ".";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

export interface PaperProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLDivElement>, PaperClassKey> {
  component?: Fjsx.DetailedHTMLProps<any, PaperProps>;
  elevation?: number;
  square?: boolean;
}

export type PaperClassKey =
  | "root"
  | "rounded"
  | "elevation0"
  | "elevation1"
  | "elevation2"
  | "elevation3"
  | "elevation4"
  | "elevation5"
  | "elevation6"
  | "elevation7"
  | "elevation8"
  | "elevation9"
  | "elevation10"
  | "elevation11"
  | "elevation12"
  | "elevation13"
  | "elevation14"
  | "elevation15"
  | "elevation16"
  | "elevation17"
  | "elevation18"
  | "elevation19"
  | "elevation20"
  | "elevation21"
  | "elevation22"
  | "elevation23"
  | "elevation24";

export const styles = theme => {
  const elevations = {};
  theme.shadows.forEach((shadow, index) => {
    elevations[`elevation${index}`] = {
      boxShadow: shadow
    };
  });

  return {
    root: {
      backgroundColor: theme.palette.background.paper
    },
    rounded: {
      borderRadius: 2
    },
    ...elevations
  };
};

export const Paper = (props: PaperProps) => {
  fjsx.setDefaults(props, {
    component: "div",
    elevation: 2,
    square: false,
    className$: null
  });
  const { className$: classNameProp$, square, elevation, ...other } = props;

  warning(
    elevation >= 0 && elevation < 25,
    `Material-UI: this elevation \`${elevation}\` is not implemented.`
  );

  const classes = jssCssRulesWithTheme("MuiPaper", props, styles);
  const className$ = classNames(
    classes.root,
    classes[`elevation${elevation}`],
    {
      [classes.rounded]: !square
    },
    classNameProp$
  );

  const Component_ = props.component;
  return <Component_ className={className$} {...other} />;
};
