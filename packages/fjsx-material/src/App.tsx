import createMuiTheme from "./styles/createMuiTheme";
import indigo from "./colors/indigo";
import pink from "./colors/pink";
import red from "./colors/red";

// All the following keys are optional.
// We try our best to provide a great default value.
const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red
  }
});

import { Button } from "./components/button/view";
import fjsx from "@fjsx/runtime";

export const App = () => {
  var btnText$ = "Success";

  return (
    <>
      <fjsx.Context key="theme" value={theme}>
        {/* <Button text$="Normal" /> */}
        <Button variant="raised" color="primary">
          Primary
        </Button>
        {/* <Button color$="secondary" text$="Secondary" />
        <Button color$="acent" text$="Accent" />
        <Button color$="success" text$={btnText$} />
        <Button color$="error" text$="Error" />
        <Button color$="warning" text$="Warning" />
        <Button color$="info" text$="Info" /> */}
      </fjsx.Context>
    </>
  );
};
