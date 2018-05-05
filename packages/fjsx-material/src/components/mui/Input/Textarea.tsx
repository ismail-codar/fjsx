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
  value$?: string;
  height$?: number;
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

/**
 * @ignore - internal component.
 */
export const Textarea = (props: TextareaProps) => {
  let shadow: HTMLTextAreaElement = null;
  let input: HTMLTextAreaElement = null;
  let singlelineShadow: HTMLTextAreaElement = null;

  const handleRefSinglelineShadow = element => {
    singlelineShadow = element;
  };
  const handleRefShadow = element => {
    shadow = element;
  };
  const handleRefInput = element => {
    input = element;
    if (props.textareaRef) {
      props.textareaRef(element);
    }
  };

  const handleChange = (event: Fjsx.KeyboardEvent<any>) => {
    props.value$ = event.target["value"];

    if (typeof props.value$ === "undefined" && shadow) {
      // The component is not controlled, we need to update the shallow value.
      shadow.value = props.value$;
    }
    if (event.key === "Enter") syncHeightWithShadow();
  };

  const syncHeightWithShadow = () => {
    if (!shadow || !singlelineShadow) {
      return;
    }

    // The component is controlled, we need to update the shallow value.
    if (typeof props.value$ !== "undefined") {
      shadow.value = props.value$ == null ? "" : String(props.value$);
    }

    const lineHeight = singlelineShadow.scrollHeight;
    let newHeight = shadow.scrollHeight;

    // Guarding for jsdom, where scrollHeight isn't present.
    // See https://github.com/tmpvar/jsdom/issues/1013
    if (newHeight === undefined) {
      return;
    }

    if (Number(props.rowsMax) >= Number(props.rows)) {
      newHeight = Math.min(Number(props.rowsMax) * lineHeight, newHeight);
    }

    newHeight = Math.max(newHeight, lineHeight);
    height$ = newHeight + lineHeight;
  };

  ////////////////////////////////////////////////////////////////////////////////////////
  fjsx.setDefaults(props, {
    rows: 1,
    value$: "",
    height$: Number(props.rows) * ROWS_HEIGHT,
    className$: null
  });
  const {
    className$,
    defaultValue,
    rows,
    rowsMax,
    textareaRef,
    value,
    ...other
  } = props;

  let height$ = props.height$;

  const classes = jssCssRulesWithTheme("MuiTextarea", props, styles);
  if (className$) delete other.className;
  return (
    <div className={classes.root} style={{ height: height$ + "px" }}>
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
        className={classNames(classes.textarea, className$)}
        defaultValue={defaultValue}
        value={value}
        onKeyPress={handleChange}
        ref={handleRefInput}
        {...other}
      />
    </div>
  );
};
