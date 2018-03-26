// @tracked
var arr = fjsx.array([]);
fjsx.createElement("div", null, "list:", function(element) {
  fjsx.arrayMap(arr, element, function(item, index) {
    return item;
  });
});
