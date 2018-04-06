import { fjsx, FJsxValue } from "fjsx";
import { cssRules } from "fjsx-cssinjs-fela";

const themes = {
  dark: {
    button: {
      backgroundColor: "black",
      color: "white"
    }
  },
  light: {
    button: {
      backgroundColor: "lightblue",
      color: "navy"
    }
  }
};

const Button = ({ children }) => {
  const theme = themes[fjsx.getContextValue("theme")];
  return (
    <button className={theme ? cssRules(theme.button) : null}>
      {children}
    </button>
  );
};

const Component1 = () => {
  return (
    <div>
      <Button>button 1</Button>
      <Button>button 2</Button>
    </div>
  );
};

var view = (
  <div>
    <Component1 />
    <fjsx.Context key="theme" value="dark">
      <Component1 />
      <fjsx.Context key="theme" value="light">
        <Component1 />
      </fjsx.Context>
      <Component1 />
    </fjsx.Context>
    <Component1 />
  </div>
);

document.body.appendChild(view);
