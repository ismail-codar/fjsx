# Fjsx

A counter example:

```jsx
var counter = fjsx.value(0);

var view = (
  <div>
    <button onClick={() => counter(counter.$val + 1)}>+</button>
    {counter.$val}
    <button onClick={() => counter(counter.$val - 1)}>-</button>
  </div>
);
document.body.appendChild(view);
```

You can browse our [todomvc example](./packages/fjsx-examples/examples/todomvc-minimal) for a more advanced example.

### [fjsx-examples](./packages/fjsx-examples) is a configured project for starting.

## Benefits & Features

* Any time created views are real DOM elements. Not virtual dom element! This feature is great and very usefull for developers. (You notice that in the above example)

* Stop the dizziness incoming by virtual dom tree rendering cycles hell. It knows where is the binded your data in the DOM and auto updates to DOM when changing data reactively. Expensive virtual dom tree checking is not required. Therefore fjsx is very fast.
* Internal state management is spontaneously included. You not need redux like framework.
* Easy understandable and debuggable code. Developers can easily find out what triggers the changes from execution callback in the debugger.
* Typescript friendly.
* Runtime is only 2 kb gzipped.

## How to works

The core is a simple reactive programming structure in [f.ts](./lib/f.ts)

##### For example:

```js
import { fjsx } from "fjsx";

var a = fjsx.value(1);
var b = fjsx.value(2);
var c = fjsx.initCompute(() => a.$val + b.$val, a, b);
console.log(c.$val); // 3 ...
a(4); // updating "a" is updates to "c" because "a" is used to "c" computation
console.log(c.$val); // 6 ...
```

This technique can be used for DOM updates. Fjsx utilizes a [babel plugin](./packages/babel-plugin-transform-fjsx) for compiling JSX views to this structure. DOM example below:

##### Jsx input:

```jsx
<div>{someVariable.$val}</div>
```

##### Compiled output:

```js
fjsx.createElement("div", null, function(element) {
  element = fjsx.createTextNode(element); //A text element parent is div
  fjsx.compute(function() {
    element.textContent = someVariable.$val; //update textContent
  }, someVariable); //when someVariable is changed
});
```

Other use cases can be viewed [in our babel plugin test fixtures](./packages/babel-plugin-transform-fjsx/test/fixtures)

## API

TODO

## Acknowledgement

Some ideas are inspired from [surplus](https://github.com/adamhaile/surplus)

```

```
