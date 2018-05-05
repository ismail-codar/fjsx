import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

import { StandardProps } from ".";
import { ModalProps, ModalClassKey, Modal } from "./Modal/Modal";
import { PaperProps, Paper } from "./Paper";
import { Theme } from "../../styles/createMuiTheme";
import {
  TransitionProps,
  TransitionHandlerProps
} from "../../transitions/transition";
import { SlideProps, Slide } from "../../transitions/Slide";
import { capitalize } from "../../utils/helpers";
import { duration } from "../../styles/transitions";

export interface DrawerProps
  extends StandardProps<
      ModalProps & Partial<TransitionHandlerProps>,
      DrawerClassKey,
      "open" | "children"
    > {
  mounted?: boolean;
  anchor?: "left" | "top" | "right" | "bottom";
  children?: any;
  elevation?: number;
  ModalProps?: Partial<ModalProps>;
  open$?: boolean;
  PaperProps?: Partial<PaperProps>;
  SlideProps?: Partial<SlideProps>;
  theme?: Theme;
  transitionDuration?: TransitionProps["timeout"];
  variant?: "permanent" | "persistent" | "temporary";
}

export type DrawerClassKey =
  | ModalClassKey
  | "docked"
  | "paper"
  | "paperAnchorLeft"
  | "paperAnchorRight"
  | "paperAnchorTop"
  | "paperAnchorBottom"
  | "paperAnchorDockedLeft"
  | "paperAnchorDockedTop"
  | "paperAnchorDockedRight"
  | "paperAnchorDockedBottom"
  | "modal";

const oppositeDirection = {
  left: "right",
  right: "left",
  top: "down",
  bottom: "up"
};

export function isHorizontal(props) {
  return ["left", "right"].indexOf(props.anchor) !== -1;
}

export function getAnchor(props) {
  return props.theme.direction === "rtl" && isHorizontal(props)
    ? oppositeDirection[props.anchor]
    : props.anchor;
}

export const styles = theme => ({
  docked: {
    flex: "0 0 auto"
  },
  paper: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    flex: "1 0 auto",
    zIndex: theme.zIndex.drawer,
    WebkitOverflowScrolling: "touch", // Add iOS momentum scrolling.
    // temporary style
    position: "fixed",
    top: 0,
    // We disable the focus ring for mouse, touch and keyboard users.
    // At some point, it would be better to keep it for keyboard users.
    // :focus-ring CSS pseudo-class will help.
    "&:focus": {
      outline: "none"
    }
  },
  paperAnchorLeft: {
    left: 0,
    right: "auto"
  },
  paperAnchorRight: {
    left: "auto",
    right: 0
  },
  paperAnchorTop: {
    top: 0,
    left: 0,
    bottom: "auto",
    right: 0,
    height: "auto",
    maxHeight: "100vh"
  },
  paperAnchorBottom: {
    top: "auto",
    left: 0,
    bottom: 0,
    right: 0,
    height: "auto",
    maxHeight: "100vh"
  },
  paperAnchorDockedLeft: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  paperAnchorDockedTop: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  paperAnchorDockedRight: {
    borderLeft: `1px solid ${theme.palette.divider}`
  },
  paperAnchorDockedBottom: {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  modal: {} // Just here so people can override the style.
});

export const Drawer = (props: DrawerProps) => {
  fjsx.setDefaults(props, {
    anchor: "left",
    elevation: 16,
    open$: false,
    transitionDuration: {
      enter: duration.enteringScreen,
      exit: duration.leavingScreen
    },
    variant: "temporary", // Mobile first.
    ModalProps: {},
    className$: null
  });
  const BackdropPropsProp = props.ModalProps.BackdropProps;
  const {
    mounted,
    anchor: anchorProp,
    children,
    className$,
    elevation,
    ModalProps,
    onClose,
    open$,
    PaperProps,
    SlideProps,
    theme,
    transitionDuration,
    variant,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiDrawer", props, styles);
  const anchor = getAnchor(props);
  const drawer = (
    <Paper
      elevation={variant === "temporary" ? elevation : 0}
      square
      className$={classNames(
        classes.paper,
        classes[`paperAnchor${capitalize(anchor)}`],
        {
          [classes[`paperAnchorDocked${capitalize(anchor)}`]]:
            variant !== "temporary"
        }
      )}
      {...PaperProps}
    >
      {children}
    </Paper>
  );

  if (variant === "permanent") {
    return (
      <div className={classNames(classes.docked, className$)} {...other}>
        {drawer}
      </div>
    );
  }

  const slidingDrawer = (
    <Slide
      in$={open$}
      direction={oppositeDirection[anchor]}
      timeout={transitionDuration}
      appear={mounted}
      {...SlideProps}
    >
      {drawer}
    </Slide>
  );

  if (variant === "persistent") {
    return (
      <div className={classNames(classes.docked, className$)} {...other}>
        {slidingDrawer}
      </div>
    );
  }

  // variant === temporary
  return (
    <Modal
      BackdropProps={{
        ...BackdropPropsProp,
        transitionDuration
      }}
      className$={classNames(classes.modal, className$)}
      open={open$}
      onClose={onClose}
      {...other}
      {...ModalProps}
    >
      {slidingDrawer}
    </Modal>
  );
};
