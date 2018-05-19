import { Transition } from "./Transition";

var show$ = false;

const transitionView1 = (
  <div style={{ paddingTop: "2rem" }}>
    <button
      onClick={() => {
        show$ = !show$;
      }}
    >
      Toggle
    </button>
    <Transition in$={show$} timeout={1000} unmountOnExit>
      {state => {
        switch (state) {
          case "entering":
            return <span>Entering…</span>;
          case "entered":
            return <span>Entered!</span>;
          case "exiting":
            return <span>Exiting…</span>;
          case "exited":
            return <span>Exited!</span>;
        }
      }}
    </Transition>
  </div>
);

document.body.appendChild(transitionView1);
