// @tracked
var value = fjsx.value(false);
fjsx.createElement("div", null, function(element) {
  var oldElement;
  fjsx.compute(function() {
    oldElement = fjsx.conditionalElement(element, oldElement, function() {
      return value.$val == true
        ? "yes"
        : fjsx.createElement("strong", null, "no");
    });
  }, value);
});
