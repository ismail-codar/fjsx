import fjsx from "@fjsx/runtime";

export const UNMOUNTED = "unmounted";
export const EXITED = "exited";
export const ENTERING = "entering";
export const ENTERED = "entered";
export const EXITING = "exiting";

export interface TransitionProps {
  domNode?: any;
  nextStatus?: string;
  nextCallback?: any;
  pendingState?: any;
  status$?: string;

  /**
   * A `function` child can be used instead of a React element.
   * This function is called with the current transition status
   * ('entering', 'entered', 'exiting', 'exited', 'unmounted'), which can be used
   * to apply context specific props to a component.
   *
   * ```jsx
   * <Transition timeout={150}>
   *   {(status) => (
   *     <MyComponent className={`fade fade-${status}`} />
   *   )}
   * </Transition>
   * ```
   */
  children?: any;

  /**
   * Show the component; triggers the enter or exit states
   */
  in: boolean;

  /**
   * By default the child component is mounted immediately along with
   * the parent `Transition` component. If you want to "lazy mount" the component on the
   * first `in={true}` you can set `mountOnEnter`. After the first enter transition the component will stay
   * mounted, even on "exited", unless you also specify `unmountOnExit`.
   */
  mountOnEnter?: boolean;

  /**
   * By default the child component stays mounted after it reaches the `'exited'` state.
   * Set `unmountOnExit` if you'd prefer to unmount the component after it finishes exiting.
   */
  unmountOnExit?: boolean;

  /**
   * Normally a component is not transitioned if it is shown when the `<Transition>` component mounts.
   * If you want to transition on the first mount set `appear` to `true`, and the
   * component will transition in as soon as the `<Transition>` mounts.
   *
   * > Note: there are no specific "appear" states. `appear` only adds an additional `enter` transition.
   */
  appear?: boolean;

  /**
   * Enable or disable enter transitions.
   */
  enter?: boolean;

  /**
   * Enable or disable exit transitions.
   */
  exit?: boolean;

  /**
   * The duration of the transition, in milliseconds.
   * Required unless `addEndListener` is provided
   *
   * You may specify a single timeout for all transitions like: `timeout={500}`,
   * or individually like:
   *
   * ```jsx
   * timeout={{
   *  enter: 300,
   *  exit: 500,
   * }}
   * ```
   *
   * @type {number | { enter?: number, exit?: number }}
   */
  timeout?: any;

  /**
   * Add a custom transition end trigger. Called with the transitioning
   * DOM node and a `done` callback. Allows for more fine grained transition end
   * logic. **Note:** Timeouts are still used as a fallback if provided.
   *
   * ```jsx
   * addEndListener={(node, done) => {
   *   // use the css transitionend event to mark the finish of a transition
   *   node.addEventListener('transitionend', done, false);
   * }}
   * ```
   */
  addEndListener?: Function;

  /**
   * Callback fired before the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEnter?: Function;

  /**
   * Callback fired after the "entering" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering?: Function;

  /**
   * Callback fired after the "entered" status is applied. An extra parameter
   * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
   *
   * @type Function(node: HtmlElement, isAppearing: bool) -> void
   */
  onEntered?: Function;

  /**
   * Callback fired before the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExit?: Function;

  /**
   * Callback fired after the "exiting" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExiting?: Function;

  /**
   * Callback fired after the "exited" status is applied.
   *
   * @type Function(node: HtmlElement) -> void
   */
  onExited?: Function;
}

const init = (props: TransitionProps) => {
  let parentGroup = null; //TODO context.transitionGroup;
  // In the context of a TransitionGroup all enters are really appears
  let appear =
    parentGroup && !parentGroup.isMounting ? props.enter : props.appear;

  let initialStatus;
  props.nextStatus = null;

  if (props.in) {
    if (appear) {
      initialStatus = EXITED;
      props.nextStatus = ENTERING;
    } else {
      initialStatus = ENTERED;
    }
  } else {
    if (props.unmountOnExit || props.mountOnEnter) {
      initialStatus = UNMOUNTED;
    } else {
      initialStatus = EXITED;
    }
  }

  props.status$ = initialStatus;

  props.nextCallback = null;
};

const getTimeouts = props => {
  const { timeout } = props;
  let exit, enter, appear;

  exit = enter = appear = timeout;

  if (timeout != null && typeof timeout !== "number") {
    exit = timeout.exit;
    enter = timeout.enter;
    appear = timeout.appear;
  }
  return { exit, enter, appear };
};

const updateStatus = (props: TransitionProps, mounting = false) => {
  let nextStatus = props.nextStatus;

  if (nextStatus !== null) {
    props.nextStatus = null;
    // nextStatus will always be ENTERING or EXITING.
    cancelNextCallback(props);
    const node = props.domNode;

    if (nextStatus === ENTERING) {
      performEnter(props, node, mounting);
    } else {
      performExit(props, node);
    }
  } else if (props.unmountOnExit && props.status$ === EXITED) {
    props.status$ = UNMOUNTED;
  }
};

const performEnter = (props: TransitionProps, node, mounting) => {
  const { enter } = props;
  // TODO const appearing = props.context.transitionGroup
  //   ? props.context.transitionGroup.isMounting
  //   : mounting;
  const appearing = mounting;

  const timeouts = getTimeouts(props);

  // no enter animation skip right to ENTERED
  // if we are mounting and running this it means appear _must_ be set
  if (!mounting && !enter) {
    safeSetState(props, { status: ENTERED }, () => {
      props.onEntered(node);
    });
    return;
  }

  props.onEnter(node, appearing);

  safeSetState(props, { status: ENTERING }, () => {
    props.onEntering(node, appearing);

    // FIXME: appear timeout?
    onTransitionEnd(props, node, timeouts.enter, () => {
      safeSetState(props, { status: ENTERED }, () => {
        props.onEntered(node, appearing);
      });
    });
  });
};

const performExit = (props: TransitionProps, node) => {
  const { exit } = props;
  const timeouts = getTimeouts(props);

  // no exit animation skip right to EXITED
  if (!exit) {
    safeSetState(props, { status: EXITED }, () => {
      props.onExited(node);
    });
    return;
  }
  props.onExit(node);

  safeSetState(props, { status: EXITING }, () => {
    props.onExiting(node);

    onTransitionEnd(props, node, timeouts.exit, () => {
      safeSetState(props, { status: EXITED }, () => {
        props.onExited(node);
      });
    });
  });
};

const cancelNextCallback = props => {
  if (props.nextCallback !== null) {
    props.nextCallback.cancel();
    props.nextCallback = null;
  }
};

const safeSetState = (props: TransitionProps, nextState, callback) => {
  // We need to track pending updates for instances where a cWRP fires quickly
  // after cDM and before the state flushes, which would double trigger a
  // transition
  props.pendingState = nextState;

  // This shouldn't be necessary, but there are weird race conditions with
  // setState callbacks and unmounting in testing, so always make sure that
  // we can cancel any pending setState callbacks after we unmount.
  callback = setNextCallback(props, callback);
  // props.setState(nextState, () => {
  //   props.pendingState = null;
  //   callback();
  // });
};

const setNextCallback = (props: TransitionProps, callback) => {
  let active = true;

  props.nextCallback = event => {
    if (active) {
      active = false;
      props.nextCallback = null;

      callback(event);
    }
  };

  props.nextCallback.cancel = () => {
    active = false;
  };

  return props.nextCallback;
};

const onTransitionEnd = (props: TransitionProps, node, timeout, handler) => {
  setNextCallback(props, handler);

  if (node) {
    if (props.addEndListener) {
      props.addEndListener(node, props.nextCallback);
    }
    if (timeout != null) {
      setTimeout(props.nextCallback, timeout);
    }
  } else {
    setTimeout(props.nextCallback, 0);
  }
};

export const Transition = (props: TransitionProps) => {
  const { children, ...childProps } = props;
  // filter props for Transtition
  delete childProps.in;
  delete childProps.mountOnEnter;
  delete childProps.unmountOnExit;
  delete childProps.appear;
  delete childProps.enter;
  delete childProps.exit;
  delete childProps.timeout;
  delete childProps.addEndListener;
  delete childProps.onEnter;
  delete childProps.onEntering;
  delete childProps.onEntered;
  delete childProps.onExit;
  delete childProps.onExiting;
  delete childProps.onExited;

  let node = null;
  if (typeof children === "function")
    node = children(props.status$, childProps);
  else node = fjsx.cloneElement(children, childProps);
  props.domNode = node;
  init(props);
  // return node;
  return <>{props.status$ ? node : null}</>;
};
