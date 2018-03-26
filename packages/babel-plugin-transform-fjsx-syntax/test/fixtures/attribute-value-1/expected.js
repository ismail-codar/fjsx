var value1 = fjsx.value("1");
var input1 = fjsx.createElement("input", {
  type: "text",
  value: function(element) {
    fjsx.compute(function() {
      element.value = value1.$val;
    }, value1);
  }
});
