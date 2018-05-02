var counter$ = fjsx.value(0);
var x$ = fjsx.value(x + 1);
var y$ = fjsx.initCompute(function() {
  return x$.$val + 1;
}, x$);
fjsx.createElement(
  "button",
  {
    onClick: function onClick() {
      return counter$(counter$.$val + 1);
    }
  },
  " + "
);
