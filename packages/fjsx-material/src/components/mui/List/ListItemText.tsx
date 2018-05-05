import fjsx from "@fjsx/runtime";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";
import classNames from "classnames";
import { Typography } from "../Typography";

import { StandardProps } from "..";

export interface ListItemTextProps
  extends StandardProps<
      Fjsx.HTMLAttributes<HTMLDivElement>,
      ListItemTextClassKey
    > {
  disableTypography?: boolean;
  inset?: boolean;
  primary?: Element | string;
  secondary?: Element | string;
  dense?: boolean;
}

export type ListItemTextClassKey =
  | "root"
  | "inset"
  | "dense"
  | "primary"
  | "secondary"
  | "textDense";

export const styles = theme => ({
  root: {
    flex: "1 1 auto",
    minWidth: 0,
    padding: `0 ${theme.spacing.unit * 2}px`,
    "&:first-child": {
      paddingLeft: 0
    }
  },
  inset: {
    "&:first-child": {
      paddingLeft: theme.spacing.unit * 7
    }
  },
  dense: {
    fontSize: theme.typography.pxToRem(13)
  },
  primary: {
    "&$textDense": {
      fontSize: "inherit"
    }
  },
  secondary: {
    "&$textDense": {
      fontSize: "inherit"
    }
  },
  textDense: {}
});

export const ListItemText = (props: ListItemTextProps) => {
  fjsx.setDefaults(props, {
    disableTypography: false,
    inset: false,
    className$: null
  });
  const {
    children,
    className$: classNameProp$,
    disableTypography,
    inset,
    primary: primaryProp,
    secondary: secondaryProp,
    dense,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiListItemText", props, styles);
  let primary = primaryProp || children;
  if (primary && !disableTypography) {
    primary = (
      <Typography
        variant="subheading"
        className$={classNames(classes.primary, { [classes.textDense]: dense })}
      >
        {primary}
      </Typography>
    );
  }

  let secondary = secondaryProp;
  if (secondary && !disableTypography) {
    secondary = (
      <Typography
        variant="body1"
        className$={classNames(classes.secondary, {
          [classes.textDense]: dense
        })}
        color="textSecondary"
      >
        {secondary}
      </Typography>
    );
  }

  return (
    <div
      className={classNames(
        classes.root,
        {
          [classes.dense]: dense,
          [classes.inset]: inset
        },
        classNameProp$
      )}
      {...other}
    >
      {primary}
      {secondary}
    </div>
  );
};
