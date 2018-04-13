import { cssRules } from "@fjsx/cssinjs-fela";

const wavesEffect = cssRules({
  position: "relative",
  overflow: "hidden"
});

export const rippleEffect = (
  node: HTMLElement,
  backgroundColor = "rgba(221, 221, 221, 0.4)"
) => {
  const wavesRipple = cssRules({
    backgroundColor: backgroundColor,
    borderRadius: "100%",
    width: "10px",
    height: "10px",
    position: "absolute"
  });

  wavesEffect.split(" ").forEach(item => node.classList.add(item));
  node.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    const button = event.currentTarget as HTMLElement;

    const xPos = event.pageX - button.offsetLeft,
      yPos = event.pageY - button.offsetTop,
      elWavesRipple = document.createElement("div");

    elWavesRipple.className = wavesRipple;
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
