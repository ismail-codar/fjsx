import { addChildElements } from "./dom-tree";

const appContext = {};

export const getContextValue = (key: string) => {
  return appContext[key];
};

export const Context = (props: {
  key: string;
  value: any;
  children: any;
  onAfterMount?: any;
}) => {
  const { key, value, children } = props;
  appContext[key] = value;
  console.log("appContext", key, value);
  props.onAfterMount = () => {
    appContext[key] = null;
  };
  debugger;
  const element = document.createDocumentFragment();
  addChildElements(element, children);
  return element;
};
