import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { ButtonBaseProps, ButtonBaseClassKey, ButtonBase } from "../ButtonBase";

export interface ListItemProps
  extends StandardProps<
      ButtonBaseProps & Fjsx.LiHTMLAttributes<HTMLElement>,
      ListItemClassKey,
      "component"
    > {
  button?: boolean;
  component?: Fjsx.DetailedHTMLProps<any, ListItemProps> | string;
  ContainerComponent?: Fjsx.DetailedHTMLProps<any, any>;
  ContainerProps?: Fjsx.HTMLAttributes<HTMLDivElement>;
  dense?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  divider?: boolean;
}

export type ListItemClassKey =
  | ButtonBaseClassKey
  | "container"
  | "keyboardFocused"
  | "default"
  | "dense"
  | "divider"
  | "gutters"
  | "button"
  | "secondaryAction";

export const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    textDecoration: "none",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "left"
  },
  container: {
    position: "relative"
  },
  keyboardFocused: {
    backgroundColor: theme.palette.action.hover
  },
  default: {
    paddingTop: 12,
    paddingBottom: 12
  },
  dense: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  disabled: {
    opacity: 0.5
  },
  divider: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundClip: "padding-box"
  },
  gutters: theme.mixins.gutters(),
  button: {
    transition: theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest
    }),
    "&:hover": {
      textDecoration: "none",
      backgroundColor: theme.palette.action.hover,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  },
  secondaryAction: {
    // Add some space to avoid collision as `ListItemSecondaryAction`
    // is absolutely positionned.
    paddingRight: theme.spacing.unit * 4
  }
});

export const ListItem = (props: ListItemProps) => {
  fjsx.setDefaults(props, {
    button: false,
    ContainerComponent: "li",
    dense: false,
    disabled: false,
    disableGutters: false,
    divider: false,
    className$: null
  });
  const {
    button,
    children: childrenProp,
    className$: classNameProp$,
    component: componentProp,
    ContainerProps: { ...ContainerProps } = {},
    dense,
    disabled,
    disableGutters,
    divider,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiListItem", props, styles);
  const isDense = dense || false;
  const children = props.children as any[];
  const hasAvatar = false; // TODO children.some(value => isMuiElement(value, ['ListItemAvatar']));
  const hasSecondaryAction = false;
  // TODO children.length && isMuiElement(children[children.length - 1], ['ListItemSecondaryAction']);

  const className = classNames(
    classes.root,
    isDense || hasAvatar ? classes.dense : classes.default,
    {
      [classes.gutters]: !disableGutters,
      [classes.divider]: divider,
      [classes.disabled]: disabled,
      [classes.button]: button,
      [classes.secondaryAction]: hasSecondaryAction
    },
    classNameProp$
  );

  const componentProps: any = { className, disabled, ...other };
  let Component = componentProp || "li";

  if (button) {
    componentProps.component = componentProp || "div";
    componentProps.classes = {
      keyboardFocused: classes.keyboardFocused
    };
    Component = ButtonBase;
  }

  if (hasSecondaryAction) {
    // Use div by default.
    Component = !componentProps.component && !componentProp ? "div" : Component;

    const ContainerComponent = props.ContainerComponent;
    // Avoid nesting of li > li.
    if (ContainerComponent === "li") {
      if (Component === "li") {
        Component = "div";
      } else if (componentProps.component === "li") {
        componentProps.component = "div";
      }
    }

    return (
      <ContainerComponent
        className={classNames(
          classes.container,
          props.ContainerProps.className
        )}
        {...ContainerProps}
      >
        <Component {...componentProps}>{children}</Component>
        {children.pop()}
      </ContainerComponent>
    );
  }

  return <Component {...componentProps}>{children}</Component>;
};
