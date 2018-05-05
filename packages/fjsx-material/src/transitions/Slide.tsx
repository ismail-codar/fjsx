import { TransitionProps } from "./transition";
import { Theme } from "../styles/createMuiTheme";
import {
  Transition,
  EnterHandler,
  ExitHandler
} from "../transition-group/Transition";
import { EventListener } from "./EventListener";
import { getTransitionProps, reflow, debounce, ownerWindow } from "./utils";

export interface SlideProps extends TransitionProps {
  direction: "left" | "right" | "up" | "down";
  theme?: Theme;
}

const GUTTER = 24;

// Translate the node so he can't be seen on the screen.
// Later, we gonna translate back the node to his original location
// with `translate3d(0, 0, 0)`.`
function getTranslateValue(props, node) {
  const { direction } = props;
  const rect = node.getBoundingClientRect();

  let transform;

  if (node.fakeTransform) {
    transform = node.fakeTransform;
  } else {
    const computedStyle = ownerWindow(node).getComputedStyle(node);
    transform =
      computedStyle.getPropertyValue("-webkit-transform") ||
      computedStyle.getPropertyValue("transform");
  }

  let offsetX = 0;
  let offsetY = 0;

  if (transform && transform !== "none" && typeof transform === "string") {
    const transformValues = transform
      .split("(")[1]
      .split(")")[0]
      .split(",");
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }

  if (direction === "left") {
    return `translateX(100vw) translateX(-${rect.left - offsetX}px)`;
  } else if (direction === "right") {
    return `translateX(-${rect.left + rect.width + GUTTER - offsetX}px)`;
  } else if (direction === "up") {
    return `translateY(100vh) translateY(-${rect.top - offsetY}px)`;
  }

  // direction === 'down'
  return `translateY(-${rect.top + rect.height + GUTTER - offsetY}px)`;
}

export function setTranslateValue(props, node) {
  const transform = getTranslateValue(props, node);

  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
}

export const Slide = (props: SlideProps) => {
  let style: any = {};
  let transition = null;

  const updatePosition = () => {
    const node = transition;
    if (node) {
      node.style.visibility = "inherit";
      setTranslateValue(props, node);
    }
  };

  const handleResize = debounce(() => {
    // Skip configuration where the position is screen size invariant.
    if (
      props.in$ ||
      props.direction === "down" ||
      props.direction === "right"
    ) {
      return;
    }

    const node = transition;
    if (node) {
      setTranslateValue(props, node);
    }
  }, 166); // Corresponds to 10 frames at 60 Hz.

  const handleEnter = node => {
    setTranslateValue(props, node);
    reflow(node);

    if (props.onEnter) {
      props.onEnter(node);
    }
  };

  const handleEntering = node => {
    const { theme } = props;

    const transitionProps = getTransitionProps(props, {
      mode: "enter"
    });
    node.style.webkitTransition = theme.transitions.create(
      "-webkit-transform",
      {
        ...transitionProps,
        easing: theme.transitions.easing.easeOut
      }
    );
    node.style.transition = theme.transitions.create("transform", {
      ...transitionProps,
      easing: theme.transitions.easing.easeOut
    });
    node.style.webkitTransform = "translate(0, 0)";
    node.style.transform = "translate(0, 0)";
    if (props.onEntering) {
      props.onEntering(node);
    }
  };

  const handleExit = node => {
    const { theme } = props;

    const transitionProps = getTransitionProps(props, {
      mode: "exit"
    });
    node.style.webkitTransition = theme.transitions.create(
      "-webkit-transform",
      {
        ...transitionProps,
        easing: theme.transitions.easing.sharp
      }
    );
    node.style.transition = theme.transitions.create("transform", {
      ...transitionProps,
      easing: theme.transitions.easing.sharp
    });
    setTranslateValue(props, node);

    if (props.onExit) {
      props.onExit(node);
    }
  };

  const handleExited = node => {
    // No need for transitions when the component is hidden
    node.style.webkitTransition = "";
    node.style.transition = "";

    if (props.onExited) {
      props.onExited(node);
    }
  };

  const {
    onEnter,
    onEntering,
    onExit,
    onExited,
    style: styleProp,
    theme,
    ...other
  } = props;

  // We use this state to handle the server-side rendering.
  // We don't know the width of the children ahead of time.
  // We need to render it.
  if (!props.in$) {
    style.visibility = "hidden";
  }

  style = {
    ...style,
    ...styleProp
  };

  return (
    <EventListener target="window" onResize={handleResize}>
      <Transition
        onEnter={handleEnter}
        onEntering={handleEntering}
        onExit={handleExit}
        onExited={handleExited}
        appear
        style={style}
        ref={node => {
          transition = node;
        }}
        {...other}
      >
        {props.children}
      </Transition>
    </EventListener>
  );
};
