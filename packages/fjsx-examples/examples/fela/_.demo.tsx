import { createRenderer } from "fela";
import { render } from "fela-dom";

const renderer = createRenderer();
render(renderer);
export const cssRules = (rule, params?) => {
  if (!params) return renderer.renderRule(() => rule, {});
  else return renderer.renderRule(rule, params);
};

var primary$ = true;
var fontSize$ = 18;

setInterval(() => {
  primary$ = !primary$;
  // fontSize$++;
}, 1000);

const view1 = (
  <button
    className={cssRules(
      state => {
        return {
          fontSize: `${state.fontSize}pt`,
          textAlign: "center",
          padding: "5px 10px",
          background: state.primary ? "green" : "blue",
          borderRadius: 5,
          ":hover": {
            background: state.primary ? "chartreuse" : "dodgerblue",
            boxShadow: "0 0 2px rgb(70, 70, 70)"
          }
        };
      },
      {
        primary: primary$,
        fontSize: fontSize$
      }
    )}
  >
    button 1
  </button>
);
const view2 = (
  <button
    className={cssRules({
      fontSize: `${fontSize$}pt`,
      textAlign: "center",
      padding: "5px 10px",
      background: primary$ ? "green" : "blue",
      borderRadius: 5,
      ":hover": {
        background: primary$ ? "chartreuse" : "dodgerblue",
        boxShadow: "0 0 2px rgb(70, 70, 70)"
      }
    })}
  >
    button 1
  </button>
);

document.body.appendChild(view1);
document.body.appendChild(view2);
