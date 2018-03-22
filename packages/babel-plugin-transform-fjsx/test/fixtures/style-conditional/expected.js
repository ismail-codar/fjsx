fjsx.createElement(
  "div",
  {
    style: {
      color: "red",
      width: function(element) {
        fjsx.compute(function() {
          element.style.width =
            state.selected.$val < 200 ? state.selected.$val : 200;
        }, state.selected);
      }
    }
  },
  "test"
);
