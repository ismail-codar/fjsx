import { jss } from "./jss-css-rules";
import { SheetsManager } from "jss";
const manager = new SheetsManager();

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

  var sheet = jss.createStyleSheet(styles, {
    meta: "ripple-effect"
  });

  const key = JSON.stringify(styles);
  if (!manager.get(key)) {
    manager.add(key, sheet);
    manager.manage(key);
  } else sheet = manager.get(key);

  node.classList.add(sheet.classes.waves);
  node.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    const button = event.currentTarget as HTMLElement;

    const xPos = event.pageX - button.offsetLeft,
      yPos = event.pageY - button.offsetTop,
      elWavesRipple = document.createElement("div");

    elWavesRipple.className = sheet.classes.ripple;
    elWavesRipple.style.left = xPos + "px";
    elWavesRipple.style.top = yPos + "px";

    const rippleElm = button.appendChild(elWavesRipple);

    var anim = elWavesRipple.animate(
      {
        opacity: [1, 0],
        transform: ["scale(1)", "scale(40)"]
      },
      {
        duration: 1000,
        easing: "ease-out"
      }
    );
    anim.onfinish = () => {
      elWavesRipple.remove();
    };
  });
};
