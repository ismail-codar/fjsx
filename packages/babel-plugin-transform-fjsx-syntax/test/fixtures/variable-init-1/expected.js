var counter$ = fjsx.value(0);
fjsx.createElement(
  "button",
  {
    onClick: function onClick() {
      return counter$(counter$.$val + 1);
    }
  },
  " + "
);
