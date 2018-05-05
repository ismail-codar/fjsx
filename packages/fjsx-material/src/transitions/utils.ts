export const reflow = node => node.scrollTop;

export function getTransitionProps(props, options) {
  const { timeout, style = {} } = props;

  return {
    duration:
      style.transitionDuration || typeof timeout === "number"
        ? timeout
        : timeout[options.mode],
    delay: style.transitionDelay
  };
}

export const debounce = (func, wait = 16, immediate = false) => {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const ownerWindow = (node: Node, fallback?: any) => {
  const doc: Document = node.ownerDocument || document;
  return doc.defaultView || doc["parentView"] || fallback;
};
