function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}
var focused$ = fjsx.value(false);
var InputElement1 = fjsx.createElement(
  Input,
  _extends(
    {
      focused$: focused$
    },
    InputProps
  )
);
var InputElement2 = fjsx.createElement(Input_, {
  value: function(element) {
    fjsx.compute(function() {
      element.value = value$.$val;
    }, value$);
  }
});
var InputElement3 = fjsx.createElement(Input, {
  value$: fjsx.initCompute(function() {
    return value$.$val + 1;
  }, value$)
});
var InputElement4 = fjsx.createElement(Input_, {
  value: function(element) {
    fjsx.compute(function() {
      element.value = value$.$val + 1;
    }, value$);
  }
});
