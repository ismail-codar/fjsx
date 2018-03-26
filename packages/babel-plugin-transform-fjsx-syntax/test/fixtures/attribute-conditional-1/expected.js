var selectedClass = fjsx.value("danger");
fjsx.createElement(
  "div",
  {
    className: function(element) {
      fjsx.compute(function() {
        element.className = "none" === selectedClass.$val ? "danger" : "";
      }, selectedClass);
    }
  },
  "test"
);
