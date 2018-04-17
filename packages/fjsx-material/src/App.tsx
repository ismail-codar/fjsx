import fjsx from "@fjsx/runtime";
import { Link, Router, Route } from "@fjsx/router";
import createMuiTheme from "./styles/createMuiTheme";
import indigo from "./colors/indigo";
import pink from "./colors/pink";
import red from "./colors/red";
import { HomePage } from "./pages/home";
import { TextFieldsPage } from "./pages/text-fields";
import { AppBarPage } from "./pages/appbar";
import { ButtonsPage } from "./pages/buttons";

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red
  }
});

export const App = () => {
  var btnText$ = "Success";

  const view = (
    <>
      <fjsx.Context key="theme" value={theme}>
        <div>
          <div>
            <Link to="/">Home</Link> |
            <Link to="/buttons">Buttons</Link> |
            <Link to="/appbar">App Bar</Link> |
            <Link to="/textfields">Text Fields</Link>
          </div>
          <hr />
        </div>

        <Router>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/buttons" component={ButtonsPage} />
          <Route path="/appbar" component={AppBarPage} />
          <Route path="/textfields" component={TextFieldsPage} />
        </Router>
      </fjsx.Context>
    </>
  );

  return view;
};
