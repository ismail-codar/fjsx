# fjsx

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
