fjsx.createElement(
  "tr",
  null,
  gridColumns.map(function(col) {
    return fjsx.createElement(
      "th",
      {
        className: function(element) {
          fjsx.compute(function() {
            element.className = classNames({
              active: sortKey$.$val == col
            });
          }, sortKey$);
        },
        onClick: function onClick() {
          return sortBy(filteredData$.$val, col);
        }
      },
      fjsx.createElement("span", null, col)
    );
  })
);
