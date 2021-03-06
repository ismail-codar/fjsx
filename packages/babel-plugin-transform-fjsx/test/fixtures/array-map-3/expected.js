fjsx.createElement("div", null, "list:", function(element) {
  fjsx.arrayMap(data, element, function(item, index) {
    item = index % 2 ? item * 2 : item * 3;
    return function(element) {
      var oldElement;
      fjsx.compute(function() {
        oldElement = fjsx.conditionalElement(
          element,
          oldElement,
          item.$val + 2 == 0
            ? fjsx.createElement("strong", null, function(element) {
                element = fjsx.createTextNode(element);
                fjsx.compute(function() {
                  element.textContent = item.$val;
                }, item);
              })
            : item.$val
        );
      }, item);
    };
  });
});
