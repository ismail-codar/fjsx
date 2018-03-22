fjsx.createElement(
  "div",
  null,
  "yes|no: ",
  function(element) {
    var oldElement;
    fjsx.compute(function() {
      oldElement = fjsx.conditionalElement(
        element,
        oldElement,
        state.$val == true ? "yes" : fjsx.createElement("strong", null, "no")
      );
    }, state);
  },
  " ",
  fjsx.createElement("hr", null),
  "true|false: ",
  function(element) {
    var oldElement;
    fjsx.compute(function() {
      oldElement = fjsx.conditionalElement(
        element,
        oldElement,
        state.$val == true
          ? fjsx.createElement("strong", null, "true")
          : "false"
      );
    }, state);
  }
);
