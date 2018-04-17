const activeContextKeys = [];
const appContext: { [key: string]: any[] } = {};

export const startContext = (key: string, value: any) => {
  if (!appContext[key]) appContext[key] = [];
  appContext[key].push(value);
  activeContextKeys.push(key);
};

export const getContextValue = (key: string, componentProps: any) => {
  if (componentProps && componentProps["$context"][key])
    return componentProps["$context"][key];
  if (appContext[key]) return appContext[key][appContext[key].length - 1];
};

export const injectContexts = (componentProps: any) => {
  if (!componentProps["$context"])
    Object.defineProperty(componentProps, "$context", {
      configurable: false,
      enumerable: false,
      value: {}
    });
  let key = null;
  for (var i = 0; i < activeContextKeys.length; i++) {
    key = activeContextKeys[i];
    componentProps["$context"][key] =
      appContext[key][appContext[key].length - 1];
  }
};

export const endContext = (key: string) => {
  appContext[key].pop();
  activeContextKeys.pop();
};

export const Context = (props: { key: string; value: any }) => null;
