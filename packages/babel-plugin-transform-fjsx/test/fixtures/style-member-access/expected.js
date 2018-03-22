fjsx.createElement(
  "div",
  {
    style: {
      color: "red",
      width: function(element) {
        fjsx.compute(function() {
          element.style.width = state.selected.$val;
        }, state.selected);
      }
    }
  },
  "test"
);
