fjsx.createElement("div", null, function(element) {
  var oldElement;
  fjsx.compute(function() {
    oldElement = fjsx.conditionalElement(
      element,
      oldElement,
      state.$val == true ? "yes" : fjsx.createElement("strong", null, "no")
    );
  }, state);
});
