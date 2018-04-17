// @inheritedComponent Transition

import fjsx from "@fjsx/runtime";
import classNames from "classnames";
// import Transition from 'react-transition-group/Transition';
import { duration } from "../styles/transitions";
// import { getTransitionProps } from '../utils';
import { jssCssRulesWithTheme } from "../utils/jss-css-rules";

export const styles = theme => ({
  container: {
    height: 0,
    overflow: "hidden",
    transition: theme.transitions.create("height")
  },
  entered: {
    height: "auto"
  },
  wrapper: {
    // Hack to get children with a negative margin to not falsify the height computation.
    display: "flex"
  },
  wrapperInner: {
    width: "100%"
  }
});

export const Collapse = props => {
  fjsx.setDefaults(props, {
    collapsedHeight: "0px",
    component: "div",
    timeout: duration.standard
  });
  const {
    children,
    className,
    collapsedHeight,
    component: Component,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExiting,
    style,
    theme,
    timeout,
    ...other
  } = props;

  const childProps = {};
  const state = "entered";
  let wrapper = null;

  fjsx.setDefaults(props, {
    collapsedHeight: "0px",
    component: "div",
    timeout: duration.standard
  });

  const classes = jssCssRulesWithTheme("MuiCollapse", props, styles);
  return (
    <Component
      className={classNames(
        classes.container,
        {
          [classes.entered]: state === "entered"
        },
        className
      )}
      style={{
        ...style,
        minHeight: collapsedHeight
      }}
      {...childProps}
    >
      <div
        className={classes.wrapper}
        ref={node => {
          wrapper = node;
        }}
      >
        <div className={classes.wrapperInner}>{children}</div>
      </div>
    </Component>
  );
};
