// <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
// <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">

export const cssLink = href => {
  const link = document.createElement("link");
  link.setAttribute("href", href);
  link.setAttribute("rel", "stylesheet");
  return link;
};
