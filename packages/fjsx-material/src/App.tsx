import fjsx from "@fjsx/runtime";
import { Link, Router, Route } from "@fjsx/router";
import createMuiTheme from "./styles/createMuiTheme";
import indigo from "./colors/indigo";
import pink from "./colors/pink";
import red from "./colors/red";
import lightBlue from "./colors/lightBlue";

import { HomePage } from "./pages/home";
import { TextFieldsPage } from "./pages/text-fields";
import { AppBarPage } from "./pages/appbar";
import { ButtonsPage } from "./pages/buttons";
import { ListPage } from "./pages/list";
import { DrawersPage } from "./pages/drawers";

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: indigo,
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
            |
            <Link to="/">Home</Link> |
            <Link to="/buttons">Buttons</Link> |
            <Link to="/appbar">App Bar</Link> |
            <Link to="/textfields">Text Fields</Link> |
            <Link to="/list">List</Link> |
            <Link to="/drawers">Drawers</Link> |
          </div>
          <hr />
        </div>

        <Router>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/buttons" component={ButtonsPage} />
          <Route path="/appbar" component={AppBarPage} />
          <Route path="/textfields" component={TextFieldsPage} />
          <Route path="/list" component={ListPage} />
          <Route path="/drawers" component={DrawersPage} />
        </Router>
      </fjsx.Context>
    </>
  );

  return view;
};
