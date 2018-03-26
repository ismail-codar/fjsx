# @babel/plugin-transform-fjsx

> Turn JSX into Fjsx function calls

A counter example with this plugin:

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

## Deprecated

Please use [babel-plugin-transform-fjsx-syntax](../babel-plugin-transform-fjsx-syntax) instead.

