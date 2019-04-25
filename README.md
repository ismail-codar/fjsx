# Fjsx


# Deprecated so please use [fidan](https://github.com/ismail-codar/fidan).

A counter example:

```jsx
var counter$ = 0; // An option: If a variable ends with $ then it is observable.

var view = (
  <>
    <button onClick={() => counter$++}> + </button>
    {counter$}
    <button onClick={() => counter$--}> - </button>
  </>
); // Bonus! view is a real DOM element(s)

document.body.appendChild(view);
```

The above example can work because our [compiler](./packages/babel-plugin-transform-fjsx-syntax) compiles to knockout style observable functions.

You can browse our [todomvc example](./packages/fjsx-examples/examples/todomvc-minimal-2) for a more advanced example.

### [fjsx-examples](./packages/fjsx-examples) is a configured project for starting.

## API

TODO

## Acknowledgement

Some ideas are inspired from [surplus](https://github.com/adamhaile/surplus)
