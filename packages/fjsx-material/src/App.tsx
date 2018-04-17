import fjsx from "@fjsx/runtime";
import { Link, Router, Route } from "@fjsx/router";
import createMuiTheme from "./styles/createMuiTheme";
import indigo from "./colors/indigo";
import pink from "./colors/pink";
import red from "./colors/red";
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
            <Link to="/about">About</Link> |
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <Router>
          <Route exact path="/" component={ButtonsPage} />
          <Route path="/about" component={AppBarPage} />
          <Route path="/contact" component={TextFieldsPage} />
        </Router>
      </fjsx.Context>
    </>
  );

  return view;
};
