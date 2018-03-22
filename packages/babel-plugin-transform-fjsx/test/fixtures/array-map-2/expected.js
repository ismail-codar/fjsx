fjsx.createElement("div", null, "list:", function(element) {
  fjsx.arrayMap(data, element, function(item, index) {
    return fjsx.createElement("strong", null, item);
  });
});
