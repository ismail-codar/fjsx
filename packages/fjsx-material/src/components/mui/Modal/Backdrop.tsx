import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";
import { TransitionProps } from "../../../transitions/transition";

export interface BackdropProps
  extends StandardProps<Fjsx.HTMLAttributes<HTMLDivElement>, BackdropClassKey> {
  invisible?: boolean;
  onClick?: Fjsx.FjsxEventHandler<{}>;
  open: boolean;
  transitionDuration?: TransitionProps["timeout"];
}

export type BackdropClassKey = "root" | "invisible";

export const styles = {
  root: {
    zIndex: -1,
    width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    // Remove grey highlight
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  invisible: {
    backgroundColor: "transparent"
  }
};

export const Backdrop = (props: BackdropProps) => {
  fjsx.setDefaults(props, {
    invisible: false,
    className$: null
  });
  const { className$, invisible, open, ...other } = props;
  const classes = jssCssRulesWithTheme("MuiBackdrop", props, styles);
  return (
    <Fade appear in={open} timeout={transitionDuration} {...other}>
      <div
        data-mui-test="Backdrop"
        className={classNames(
          classes.root,
          {
            [classes.invisible]: invisible
          },
          className$
        )}
        aria-hidden="true"
      />
    </Fade>
  );
};
