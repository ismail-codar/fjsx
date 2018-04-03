const appContext: { [key: string]: any[] } = {};

export const startContext = (key: string, value: any) => {
  if (!appContext[key]) appContext[key] = [];
  appContext[key].push(value);
};

export const getContextValue = (key: string) => {
  return appContext[key][appContext[key].length - 1];
};

export const endContext = (key: string) => {
  appContext[key].pop();
};

export const Context = (props: { key: string; value: any }) => null;
