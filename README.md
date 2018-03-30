# Fjsx

A counter example:

```jsx
var counter$ = 0; // An option: If variables ending with $ they are observable.

var view = (
  <div>
    <button onClick={() => counter$++}> + </button>
    {counter$}
    <button onClick={() => counter$--}> - </button>
  </div>
); // Bonus! view is a real DOM element
document.body.appendChild(view);
```

The above example can work because it compiles to knockout style observable functions for you.

You can browse our [todomvc example](./packages/fjsx-examples/examples/todomvc-minimal-2) for a more advanced example.

### [fjsx-examples](./packages/fjsx-examples) is a configured project for starting.

## API

TODO

## Acknowledgement

Some ideas are inspired from [surplus](https://github.com/adamhaile/surplus)
