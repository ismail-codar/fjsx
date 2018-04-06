var jsxEventProperty = /^on[A-Z]/;
export const Fragment = Symbol("fjsx.Fragment");

export const createElement = (
  tagName: string | Function | Symbol,
  attributes: { [key: string]: any },
  ...childs: any[]
) => {
  let element = null;
  if (tagName instanceof Function) {
    if (attributes === null) attributes = {};
    attributes["children"] = childs;
    element = (tagName as any)(attributes);
  } else {
    if (tagName === Fragment) {
      element = document.createDocumentFragment();
    } else {
      element = document.createElement(tagName as any);
      if (attributes) {
        let attribute = null;
        for (var attributeName in attributes) {
          attribute = attributes[attributeName];
          if (attribute instanceof Function) {
            if (jsxEventProperty.test(attributeName)) {
              attributeName = attributeName.toLowerCase();
              element[attributeName] = attribute;
            } else attribute(element);
          } else if (attribute instanceof Object) {
            //style
            for (var key in attribute)
              if (typeof attribute[key] === "function") attribute[key](element);
          } else {
            if (attributeName.indexOf("-") !== -1)
              element.setAttribute(attributeName, attribute);
            else element[attributeName] = attribute;
          }
        }
      }
    }
    if (childs && childs.length) addChildElements(element, childs);
  }
  return element;
};

export const addChildElements = (element, childs) => {
  let props = null;
  for (var i = 0; i < childs.length; i++) {
    if (Array.isArray(childs[i])) addChildElements(element, childs[i]);
    else if (childs[i] instanceof Function) childs[i](element);
    else {
      childs[i] &&
        element.appendChild(
          childs[i] instanceof Node
            ? childs[i]
            : document.createTextNode(childs[i])
        );
    }
  }
};

export const createTextNode = parent => {
  return parent.appendChild(document.createTextNode(""));
};
