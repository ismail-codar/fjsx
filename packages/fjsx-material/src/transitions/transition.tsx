import { CSSProperties } from "../../../../JSX";

export interface _TransitionProps {
  onEnter: any;
  onEntering: any;
  onEntered: any;
  onExit: any;
  onExiting: any;
  onExited: any;
  in$: any;
  mountOnEnter: any;
  unmountOnExit: any;
  timeout: any;
  addEndListener: any;
}
export interface TransitionActions {}

export type TransitionHandlerKeys =
  | "onEnter"
  | "onEntering"
  | "onEntered"
  | "onExit"
  | "onExiting"
  | "onExited";
export type TransitionHandlerProps = Pick<
  _TransitionProps,
  TransitionHandlerKeys
>;

export type TransitionKeys =
  | "in$"
  | "mountOnEnter"
  | "unmountOnExit"
  | "timeout"
  | "addEndListener"
  | TransitionHandlerKeys;
export interface TransitionProps extends TransitionActions {
  children?: any;
  style?: CSSProperties;
  onEnter?: any;
  onEntering?: any;
  onEntered?: any;
  onExit?: any;
  onExiting?: any;
  onExited?: any;
  in$?: any;
  mountOnEnter?: any;
  unmountOnExit?: any;
  timeout?: any;
  addEndListener?: any;
  appear?: boolean;
}
