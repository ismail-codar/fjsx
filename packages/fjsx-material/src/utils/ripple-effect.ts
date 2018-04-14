import { jss, jssCssRulesWithTheme } from "./jss-css-rules";
import { SheetsManager } from "jss";

export const rippleEffect = (
  node: HTMLElement,
  backgroundColor = "rgba(221, 221, 221, 0.4)"
) => {
  const styles = {
    waves: {
      position: "relative",
      overflow: "hidden"
    },
    ripple: {
      backgroundColor: backgroundColor,
      borderRadius: "100%",
      width: "10px",
      height: "10px",
      position: "absolute"
    }
  };

  const classes = jssCssRulesWithTheme("re", null, styles, true);

  node.classList.add(classes.waves);
  node.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    const button = event.currentTarget as HTMLElement;

    const xPos = event.pageX - button.offsetLeft,
      yPos = event.pageY - button.offsetTop,
      elWavesRipple = document.createElement("div");

    elWavesRipple.className = classes.ripple;
    elWavesRipple.style.left = xPos + "px";
    elWavesRipple.style.top = yPos + "px";

    const rippleElm = button.appendChild(elWavesRipple);

    elWavesRipple.animate(
      { opacity: [1, 0], transform: ["scale(1)", "scale(40)"] },
      {
        duration: 1000,
        easing: "ease-out"
      }
    ).onfinish = () => {
      elWavesRipple.remove();
    };
  });
};
