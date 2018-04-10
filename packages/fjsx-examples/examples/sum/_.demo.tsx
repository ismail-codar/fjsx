var xValue$ = 0;
var yValue$ = 0;
var resultValue$ = xValue$ + yValue$;

const toNumber = val => Number(val);

const view = (
  <form>
    <input
      onInput={e => (xValue$ = toNumber(e.currentTarget.value))}
      value="0"
    />
    +
    <input
      onInput={e => (yValue$ = toNumber(e.currentTarget.value))}
      value="0"
    />
    =
    <span>{resultValue$}</span>
  </form>
);

document.body.appendChild(view);
