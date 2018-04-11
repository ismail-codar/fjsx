import { fromEvent, combine, Stream, from } from "most";

var xValue$ = null;
var yValue$ = null;
var resultValue$ = null;

const add = (x: number, y: number) => x + y;

const toNumber = val => Number(val);

const x: Stream<number> = from(fjsx.toObservable<Stream<number>>(xValue$)).map(
  toNumber
);
const y: Stream<number> = from(fjsx.toObservable<Stream<number>>(yValue$)).map(
  toNumber
);

const result = combine(add, x, y);
result.observe(val => (resultValue$ = val));

const view = (
  <form>
    <input onInput={e => (xValue$ = e.currentTarget.value)} value="0" /> +
    <input onInput={e => (yValue$ = e.currentTarget.value)} value="0" /> =
    <span>{resultValue$}</span>
  </form>
);

document.body.appendChild(view);
