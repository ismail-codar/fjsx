var counter$ = 0;

var viewCounter2 = (
  <>
    <button onClick={() => counter$++}> + </button>
    {counter$}
    <button onClick={() => counter$--}> - </button>
  </>
);
document.body.appendChild(viewCounter2);
