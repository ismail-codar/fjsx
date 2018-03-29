const appContext = {};
export const getContextValue = (key: string, componentId: string) => {
  return null;
};
export const Context = (props: { key: string; value: any }) => {
  const { key, value } = props;
  appContext[key] = value;
  //TODO childeren render süresince context geçerli olup render bitince kaybolmalı
  return <div>sss</div>;
};
