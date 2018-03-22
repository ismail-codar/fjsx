fjsx.createElement("div", null, function(element) {
  element = fjsx.createTextNode(element);
  fjsx.compute(function() {
    element.textContent = state.a.b.c.$val;
  }, state.a.b.c);
});
