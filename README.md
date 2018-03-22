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

You notice that in the above example: Created view is a dom element. Not virtual dom element! This feature is great and very usefull for developers.

Also this is not virtual dom library unlike the React, Angular, Vue etc.. Stop the dizziness incoming by render cycles.

Fsx knows where is the binded your data in the DOM and auto updates to DOM when changing data reactively.

### How to works

The core is a simple reactive programming structure in [f.ts](./lib/f.ts)

##### For example:

```js
import { fjsx } from "fjsx";

var a = fjsx.value(1);
var b = fjsx.value(2);
var c = fjsx.initCompute(() => a.$val + b.$val, a, b);
console.log(c.$val); // 3 ...
a(4); // update the "a" also it updates to "c" because "a" is used to "c" computation
console.log(c.$val); // 6 ...
```

This technique can be used for DOM updates. Also fjsx is uses a [babel plugin](./packages/babel-plugin-transform-fjsx) for compiling JSX views to this structure. DOM example below:

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

Other use cases can be viewed [in our babel plugin tests](./packages/babel-plugin-transform-fjsx/test/fixtues)

### API

TODO

### Acknowledgement

Some ideas are inspired from [surplus](https://github.com/adamhaile/surplus)

```

```
