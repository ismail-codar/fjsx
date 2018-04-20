import fjsx from "@fjsx/runtime";
import classNames from "classnames";
import { jssCssRulesWithTheme } from "../../../utils/jss-css-rules";

import { StandardProps } from "..";

export interface TextareaProps
  extends StandardProps<
      Fjsx.TextareaHTMLAttributes<HTMLTextAreaElement>,
      TextareaClassKey,
      "rows"
    > {
  defaultValue?: any;
  disabled?: boolean;
  rows?: number;
  rowsMax?: string | number;
  textareaRef?: Fjsx.Ref<any>;
  value?: string;
  height?: number;
}

export type TextareaClassKey = "root" | "shadow" | "textarea";

const ROWS_HEIGHT = 19;

export const styles = {
  root: {
    position: "relative", // because the shadow has position: 'absolute',
    width: "100%"
  },
  textarea: {
    width: "100%",
    height: "100%",
    resize: "none",
    font: "inherit",
    padding: 0,
    cursor: "inherit",
    boxSizing: "border-box",
    lineHeight: "inherit",
    border: "none",
    outline: "none",
    background: "transparent"
  },
  shadow: {
    resize: "none",
    // Overflow also needed to here to remove the extra row
    // added to textareas in Firefox.
    overflow: "hidden",
    // Visibility needed to hide the extra text area on ipads
    visibility: "hidden",
    position: "absolute",
    height: "auto",
    whiteSpace: "pre-wrap"
  }
};

const handleRefSinglelineShadow = element => {
  // TODO handleRefSinglelineShadow
  return null;
};
const handleRefShadow = element => {
  // TODO handleRefShadow
  return null;
};
const handleRefInput = element => {
  // TODO handleRefInput
  return null;
};

const handleChange = (e: Fjsx.ChangeEvent<any>) => {
  //TODO handleChange
};

/**
 * @ignore - internal component.
 */
export const Textarea = (props: TextareaProps) => {
  fjsx.setDefaults(props, {
    rows: 1
  });
  const {
    className,
    defaultValue,
    onChange,
    rows,
    rowsMax,
    textareaRef,
    height,
    value,
    ...other
  } = props;

  const classes = jssCssRulesWithTheme("MuiTextarea", props, styles);
  return (
    <div className={classes.root} style={{ height: height }}>
      {/* TODO <EventListener target="window" onResize={handleResize} /> */}
      <textarea
        ref={handleRefSinglelineShadow}
        className={classNames(classes.shadow, classes.textarea)}
        tabIndex={-1}
        rows={1}
        readOnly
        aria-hidden="true"
        value=""
      />
      <textarea
        ref={handleRefShadow}
        className={classNames(classes.shadow, classes.textarea)}
        tabIndex={-1}
        rows={rows}
        aria-hidden="true"
        readOnly
        defaultValue={defaultValue}
        value={value}
      />
      <textarea
        rows={rows}
        className={classNames(classes.textarea, className)}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        ref={handleRefInput}
        {...other}
      />
    </div>
  );
};
