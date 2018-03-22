export const cssLink = href => {
  const link = document.createElement("link");
  link.setAttribute("href", href);
  link.setAttribute("rel", "stylesheet");
  return link;
};
