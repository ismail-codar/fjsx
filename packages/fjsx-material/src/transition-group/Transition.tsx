export type EndHandler = (node: HTMLElement, done: () => void) => void;
export type EnterHandler = (node: HTMLElement, isAppearing: boolean) => void;
export type ExitHandler = (node: HTMLElement) => void;

export const UNMOUNTED = "unmounted";
export const EXITED = "exited";
export const ENTERING = "entering";
export const ENTERED = "entered";
export const EXITING = "exiting";

export interface TransitionActions {
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
}

export interface TransitionProps extends TransitionActions {
  children?: any;
  style?: any;
  ref?: any;
  in?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  timeout?: number | { enter?: number; exit?: number };
  addEndListener?: EndHandler;
  onEnter?: EnterHandler;
  onEntering?: EnterHandler;
  onEntered?: EnterHandler;
  onExit?: ExitHandler;
  onExiting?: ExitHandler;
  onExited?: ExitHandler;
}

// Name the function so it is clearer in the documentation
function noop() {}

// TODO https://github.com/reactjs/react-transition-group/blob/master/src/Transition.js

export const Transition = (props: TransitionProps) => {
  fjsx.setDefaults(props, {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,

    onEnter: noop,
    onEntering: noop,
    onEntered: noop,

    onExit: noop,
    onExiting: noop,
    onExited: noop
  });

  if (props.children.length === 1) {
    // TODO React.Children.map like usage
    var child = props.children[0];
    if (Array.isArray(child) && child.length === 1) {
      child = child[0];
      Object.assign(child.style, props.style);
    }
  }

  return props.children;
};
