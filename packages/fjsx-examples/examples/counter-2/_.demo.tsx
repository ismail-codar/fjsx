import { fjsx, FJsxValue } from "fjsx";

var counter$ = 0;

var view = (
  <div>
    <button onClick={() => counter$++}> + </button>
    {counter$}
    <button onClick={() => counter$--}> - </button>
  </div>
);
document.body.appendChild(view);
