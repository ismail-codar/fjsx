fjsx.createElement("div", null, "value:", function(element) {
  element = fjsx.createTextNode(element);
  fjsx.compute(function() {
    element.textContent = state.$val;
  }, state);
});
