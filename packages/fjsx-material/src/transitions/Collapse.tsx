// @inheritedComponent Transition

import fjsx from "@fjsx/runtime";
import classNames from "classnames";
// import Transition from 'react-transition-group/Transition';
import { duration } from "../styles/transitions";
// import { getTransitionProps } from '../utils';
import { jssCssRulesWithTheme } from "../utils/jss-css-rules";
import { StandardProps } from "../components/mui";
import { Theme } from "../styles/createMuiTheme";
import { TransitionProps } from "./transition";

export interface CollapseProps
  extends StandardProps<TransitionProps, CollapseClassKey, "timeout"> {
  children?: any;
  collapsedHeight?: string;
  component?: Fjsx.DetailedHTMLProps<any, CollapseProps>;
  theme?: Theme;
  timeout?: TransitionProps["timeout"] | "auto";
  open$: boolean;
}

export type CollapseClassKey = "container" | "entered";

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

export const Collapse = (props: CollapseProps) => {
  fjsx.setDefaults(props, {
    collapsedHeight: "0px",
    component: "div",
    className$: null
  });
  const {
    children,
    className$,
    collapsedHeight,
    component: Component,
    style,
    theme,
    timeout,
    ...other
  } = props;

  const childProps = {};
  let wrapper = null;

  const classes = jssCssRulesWithTheme("MuiCollapse", props, styles);
  return (
    <Component
      className={classNames(
        classes.container,
        {
          [classes.entered]: props.open$ === true
        },
        className$
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
