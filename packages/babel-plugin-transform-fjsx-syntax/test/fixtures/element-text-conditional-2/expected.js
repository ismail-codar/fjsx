// @tracked
fjsx.createElement("div", null, function(element) {
  var oldElement;
  fjsx.compute(function() {
    oldElement = fjsx.conditionalElement(
      element,
      oldElement,
      item.value$.$val == true
        ? "yes"
        : fjsx.createElement("strong", null, "no")
    );
  }, item.value$);
});
