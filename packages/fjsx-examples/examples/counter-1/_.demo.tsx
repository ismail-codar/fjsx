const counter = fjsx.value(0);

var view1 = (
  <div>
    <button onClick={() => counter(counter.$val + 1)}>+</button>
    {counter.$val}
    <button onClick={() => counter(counter.$val - 1)}>-</button>
  </div>
);
document.body.appendChild(view1);
