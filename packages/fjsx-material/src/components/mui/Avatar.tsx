import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

import { StandardProps } from ".";

export interface AvatarProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLDivElement>, AvatarClassKey> {
  alt?: string;
  childrenClassName?: string;
  component?: Fjsx.DetailedHTMLProps<any, AvatarProps>;
  imgProps?: Fjsx.HtmlHTMLAttributes<HTMLImageElement>;
  sizes?: string;
  src?: string;
  srcSet?: string;
}

export type AvatarClassKey = "root" | "colorDefault" | "img";

export const styles = theme => ({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(20),
    borderRadius: "50%",
    overflow: "hidden",
    userSelect: "none"
  },
  colorDefault: {
    color: theme.palette.background.default,
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[600]
  },
  img: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    // Handle non-square image. The property isn't supported by IE11.
    objectFit: "cover"
  }
});

export const Avatar = (props: AvatarProps) => {
  fjsx.setDefaults(props, {
    component: "div",
    className$: null
  });
  const {
    alt,
    childrenClassName: childrenclassNameProp$,
    className$: classNameProp$,
    component: Component,
    imgProps,
    sizes,
    src,
    srcSet,
    ...other
  } = props;
  const classes = jssCssRulesWithTheme("MuiAvatar", props, styles);
  const childrenProp = props.children[0];
  const className = classNames(
    classes.root,
    {
      [classes.colorDefault]: childrenProp && !src && !srcSet
    },
    classNameProp$
  );
  let children = null;

  if (childrenProp) {
    if (childrenclassNameProp$ && typeof childrenProp !== "string") {
      const childrenClassName = classNames(
        childrenclassNameProp$,
        childrenProp.props.className
      );
      children = fjsx.cloneElement(childrenProp, {
        className: childrenClassName
      });
    } else {
      children = childrenProp;
    }
  } else if (src || srcSet) {
    children = (
      <img
        alt={alt}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        className={classes.img}
        {...imgProps}
      />
    );
  }

  return (
    <Component className={className} {...other}>
      {children}
    </Component>
  );
};
