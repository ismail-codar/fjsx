import { fjsx, FJsxValue } from "fjsx";

const Component1 = () => {
  console.log("Component1");
  return <div>Component1: {fjsx.getContextValue("theme") || "-"}</div>;
};

var view = (
  <div>
    <Component1 />
    <fjsx.Context key="theme" value="tema1">
      <Component1 />
      <fjsx.Context key="theme" value="tema2">
        <Component1 />
      </fjsx.Context>
      <Component1 />
    </fjsx.Context>
    <Component1 />
  </div>
);

document.body.appendChild(view);
