import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

export interface PortalProps {
  children: Fjsx.FjsxElement<any>;
  container?: any;
  onRendered?: () => void;
}

export const Portal = (props: PortalProps) => {
  return null;
};
