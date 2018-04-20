import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../utils/jss-css-rules";

import { StandardProps } from ".";
import { PaperProps } from "./Paper";
import { ModalProps, ModalClassKey } from "./Modal";

export interface PopoverOrigin {
  horizontal: "left" | "center" | "right" | number;
  vertical: "top" | "center" | "bottom" | number;
}

export interface PopoverPosition {
  top: number;
  left: number;
}

export type PopoverReference = "anchorEl" | "anchorPosition";

export interface PopoverProps
  extends StandardProps<ModalProps, PopoverClassKey, "children"> {
  action?: (actions: PopoverActions) => void;
  anchorEl?: HTMLElement | ((element: HTMLElement) => HTMLElement);
  anchorOrigin?: PopoverOrigin;
  anchorPosition?: PopoverPosition;
  anchorReference?: PopoverReference;
  children?: any;
  elevation?: number;
  getContentAnchorEl?: (element: HTMLElement) => HTMLElement;
  marginThreshold?: number;
  modal?: boolean;
  PaperProps?: Partial<PaperProps>;
  role?: string;
  transformOrigin?: PopoverOrigin;
  transition?: any;
  transitionDuration?: any;
}

export type PopoverClassKey = ModalClassKey | "paper";

export interface PopoverActions {
  updatePosition(): void;
}

export const Popover = (props: PopoverProps) => {
  return null;
};
