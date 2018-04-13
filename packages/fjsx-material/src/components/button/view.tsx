import fjsx from "@fjsx/runtime";

import { cssRules } from "@fjsx/cssinjs-fela";
import { rippleEffect } from "../../util/ripple-effect";
import { Theme } from "../../styles/createMuiTheme";

const buttonBgColors = {
  primary: "rgb(25, 118, 210)",
  secondary: "rgb(66, 66, 66)",
  acent: "rgb(130, 177, 255)",
  success: "rgb(76, 175, 80)",
  error: "rgb(255, 82, 82)",
  warning: "rgb(255, 193, 7)",
  info: "rgb(33, 150, 243)",
  disabled: "rgba(0, 0, 0, 0.26)",
  null: "rgb(245, 245, 245)"
};

export const Button = (props: {
  text$: string;
  color$?:
    | "primary"
    | "secondary"
    | "acent"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "null";
  block?: boolean;
  depressed?: boolean;
  fab?: boolean;
  flat?: boolean;
  icon?: boolean;
  large?: boolean;
  loading?: boolean;
  outline?: boolean;
  ripple?: boolean;
  round?: boolean;
  small?: boolean;
  tag?: string;
  type?: string;
  value?: any;
}) => {
  fjsx.setDefaults(props, { color$: "null" });

  const theme = fjsx.getContextValue("theme") as Theme;
  console.log(theme);

  return (
    <button
      ref={elem => {
        rippleEffect(elem);
      }}
      type="button"
      className={cssRules({
        backgroundColor: buttonBgColors[props.color$],
        borderColor: buttonBgColors[props.color$],
        cursor: "pointer",
        overflow: "visible",
        textTransform: "uppercase",
        borderStyle: "none",
        color:
          props.color$ == "null" ? "rgba(0,0,0,.87)" : "rgb(255, 255, 255)",
        alignItems: "center",
        borderRadius: "2px",
        display: "inline-flex",
        height: "36px",
        flex: "0 1 auto",
        fontSize: "14px",
        fontWeight: "500",
        justifyContent: "center",
        margin: "6px 8px",
        minWidth: "88px",
        outline: "0px",
        overflowX: "hidden",
        overflowY: "hidden",
        textDecoration: "none",
        transition: "0.3s cubic-bezier(0.25, 0.8, 0.5, 1), color 1ms",
        position: "relative",
        verticalAlign: "middle",
        userSelect: "none",
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px"
      })}
    >
      <div
        className={cssRules({
          alignItems: "center",
          display: "flex",
          flex: "1 0 auto",
          justifyContent: "center",
          margin: "0px auto",
          padding: "0px 16px",
          transition: "0.3s cubic-bezier(0.25, 0.8, 0.5, 1)",
          whiteSpace: "nowrap",
          "::before": {
            content: "''",
            position: "absolute",
            left: "0px",
            top: "0px",
            height: "100%",
            opacity: "0.12",
            transition: "0.3s cubic-bezier(0.25, 0.8, 0.5, 1)",
            width: "100%"
          }
        })}
      >
        {props.text$}
      </div>
    </button>
  );
};
