import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { PropTypes, StandardProps } from ".";
import { Style, TextStyle } from "../../styles/createTypography";
import { capitalize } from "../../utils/helpers";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

export interface TypographyProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLElement>, TypographyClassKey> {
  align?: PropTypes.Alignment;
  color?: PropTypes.Color | "textSecondary" | "error";
  component?: Element | string;
  gutterBottom?: boolean;
  headlineMapping?: { [type in TextStyle]: string };
  noWrap?: boolean;
  paragraph?: boolean;
  variant?: Style | "caption" | "button";
}

export type TypographyClassKey =
  | "root"
  | "display4"
  | "display3"
  | "display2"
  | "display1"
  | "headline"
  | "title"
  | "subheading"
  | "body2"
  | "body1"
  | "caption"
  | "button"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "alignJustify"
  | "noWrap"
  | "gutterBottom"
  | "paragraph"
  | "colorInherit"
  | "colorSecondary"
  | "colorTextSecondary";

export const styles = theme => ({
  root: {
    display: "block",
    margin: 0
  },
  display4: theme.typography.display4,
  display3: theme.typography.display3,
  display2: theme.typography.display2,
  display1: theme.typography.display1,
  headline: theme.typography.headline,
  title: theme.typography.title,
  subheading: theme.typography.subheading,
  body2: theme.typography.body2,
  body1: theme.typography.body1,
  caption: theme.typography.caption,
  button: theme.typography.button,
  alignLeft: {
    textAlign: "left"
  },
  alignCenter: {
    textAlign: "center"
  },
  alignRight: {
    textAlign: "right"
  },
  alignJustify: {
    textAlign: "justify"
  },
  noWrap: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  gutterBottom: {
    marginBottom: "0.35em"
  },
  paragraph: {
    marginBottom: theme.spacing.unit * 2
  },
  colorInherit: {
    color: "inherit"
  },
  colorPrimary: {
    color: theme.palette.primary.main
  },
  colorSecondary: {
    color: theme.palette.secondary.main
  },
  colorTextSecondary: {
    color: theme.palette.text.secondary
  },
  colorError: {
    color: theme.palette.error.main
  }
});

export const Typography = (props: TypographyProps) => {
  fjsx.setDefaults(props, {
    align: "inherit",
    color: "default",
    gutterBottom: false,
    headlineMapping: {
      display4: "h1",
      display3: "h1",
      display2: "h1",
      display1: "h1",
      headline: "h1",
      title: "h2",
      subheading: "h3",
      body2: "aside",
      body1: "p"
    },
    noWrap: false,
    paragraph: false,
    variant: "body1"
  });
  const {
    align,
    className: classNameProp,
    component: componentProp,
    color,
    gutterBottom,
    headlineMapping,
    noWrap,
    paragraph,
    variant,
    ...other
  } = props;

  const classes: any = jssCssRulesWithTheme("MuiTypography", props, styles);
  const className = classNames(
    classes.root,
    classes[variant],
    {
      [classes[`color${capitalize(color)}`]]: color !== "default",
      [classes.noWrap]: noWrap,
      [classes.gutterBottom]: gutterBottom,
      [classes.paragraph]: paragraph,
      [classes[`align${capitalize(align)}`]]: align !== "inherit"
    },
    classNameProp
  );

  const Component =
    componentProp || (paragraph ? "p" : headlineMapping[variant]) || "span";

  return <Component className={className} {...other} />;
};
