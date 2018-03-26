import { fjsx, FJsxValue } from "fjsx";

var counter$ = 0;

var view = (
  <div>
    <button onClick={() => (counter$ = counter$ + 1)}> + </button>
    {counter$}
    <button onClick={() => (counter$ = counter$ - 1)}> - </button>
  </div>
);
document.body.appendChild(view);
