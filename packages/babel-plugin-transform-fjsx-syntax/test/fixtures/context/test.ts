//fjsx.Context createElement i bul
//arguments.push(fjsx.endContext())

const Component1 = () => {
  console.log("Component1");
  return null;
};
const fjsx = {
  Context: () => {
    debugger;
    console.log("Context create");
  },
  createElement: (tagName, attributes, ...childs: any[]) => {
    debugger;
    if (tagName instanceof Function) tagName();
    console.log("createElement", tagName.name || tagName);
  },
  endContext: () => {
    debugger;
    console.log("endContext");
  }
};

fjsx.createElement(
  "div",
  null,
  fjsx.createElement(fjsx.Context, {
    key: "theme",
    value: "tema1"
  }),
  fjsx.createElement(Component1, null),
  fjsx.endContext()
);
