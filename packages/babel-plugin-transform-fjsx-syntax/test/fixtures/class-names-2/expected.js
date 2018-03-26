fjsx.createElement(
  "div",
  {
    className: function(element) {
      fjsx.compute(
        function() {
          element.className = classNames(
            {
              editing: data.editing.$val,
              completed: data.completed.$val
            },
            data.highligth.$val
          );
        },
        data.editing,
        data.completed,
        data.highligth
      );
    }
  },
  "test"
);
