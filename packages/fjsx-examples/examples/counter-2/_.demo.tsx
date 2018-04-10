import { FJsxValue } from "fjsx";

var counter$ = 0;

var view = (
  <>
    <button onClick={() => counter$++}> + </button>
    {counter$}
    <button onClick={() => counter$--}> - </button>
  </>
);
document.body.appendChild(view);
