fjsx.createElement("div", null, function(element) {
  var oldElement;
  fjsx.compute(function() {
    oldElement = fjsx.conditionalElement(
      element,
      oldElement,
      todo.showing$.$val ? fjsx.createElement("span", null, "showing") : null
    );
  }, todo.showing$);
});
