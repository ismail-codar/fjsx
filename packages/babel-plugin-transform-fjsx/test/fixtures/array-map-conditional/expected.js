fjsx.createElement("div", null, "list:", function(element) {
  fjsx.arrayMap(props.data, element, function(item, index) {
    return function(element) {
      var oldElement;
      fjsx.compute(function() {
        oldElement = fjsx.conditionalElement(
          element,
          oldElement,
          item.$val % 2 == 0
            ? item.$val
            : fjsx.createElement("strong", null, "item:", function(element) {
                element = fjsx.createTextNode(element);
                fjsx.compute(function() {
                  element.textContent = item.$val;
                }, item);
              })
        );
      }, item);
    };
  });
});
