import * as store from "./store";
import * as state from "./state";

var startTime;
var lastMeasure;
var startMeasure = function(name) {
  startTime = performance.now();
  lastMeasure = name;
};
var stopMeasure = function() {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function() {
      lastMeasure = null;
      var stop = performance.now();
      console.log(last + " took " + (stop - startTime));
    }, 0);
  }
};

export function run() {
  startMeasure("run");
  state.data([]);
  const { id } = state;
  const obj = store.run(id.$val);
  state.id(obj.id);
  state.data(obj.data);
  state.selected(null);
  stopMeasure();
}

export function add() {
  startMeasure("add");
  const id = state.id.$val;
  const obj = store.add(id, state.data.$val);
  state.id(obj.id);
  for (var i = id - 1; i < obj.data.length; i++) {
    state.data.$val.push(obj.data[i]);
  }
  stopMeasure();
}
export function update() {
  startMeasure("update");
  store.update(state.data);
  stopMeasure();
}
export function select(id: number) {
  startMeasure("select");
  state.selected(id);
  stopMeasure();
}
export function delete_(idx: number) {
  startMeasure("delete");
  state.data.$val.splice(idx, 1);
  stopMeasure();
}
export function runLots() {
  startMeasure("runLots");
  state.id(1);
  state.data([]);
  const { id } = state;
  const obj = store.runLots(id.$val);
  state.id(obj.id);
  state.data(obj.data);
  state.selected(null);
  stopMeasure();
}
export function clear() {
  startMeasure("clear");
  window.requestAnimationFrame(() => {
    state.data([]);
    state.selected(null);
    stopMeasure();
  });
}
export function swapRows() {
  startMeasure("swapRows");
  store.swapRows(state.data.$val);
  stopMeasure();
}
