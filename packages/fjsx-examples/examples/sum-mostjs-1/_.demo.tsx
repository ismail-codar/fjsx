import { fromEvent, combine, Stream } from "most";

var xInput: HTMLInputElement = null;
var yInput: HTMLInputElement = null;
var resultValue$ = null;

const add = (x: number, y: number) => x + y;

const toNumber = e => Number(e.target.value);

const view = (
  <form>
    <input ref={dom => (xInput = dom)} value="0" /> +
    <input ref={dom => (yInput = dom)} value="0" /> =
    <span>{resultValue$}</span>
  </form>
);

const x: Stream<number> = fromEvent("input", xInput).map(toNumber);
const y: Stream<number> = fromEvent("input", yInput).map(toNumber);
const result = combine(add, x, y);
result.observe(val => (resultValue$ = val));

document.body.appendChild(view);
