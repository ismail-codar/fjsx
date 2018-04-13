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
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  }
});

console.log(theme);

import { Button } from "./components/button/view";

export const App = () => {
  var btnText$ = "Success";

  return (
    <div>
      <Button text$="Normal" />
      <Button color$="primary" text$="Primary" />
      <Button color$="secondary" text$="Secondary" />
      <Button color$="acent" text$="Accent" />
      <Button color$="success" text$={btnText$} />
      <Button color$="error" text$="Error" />
      <Button color$="warning" text$="Warning" />
      <Button color$="info" text$="Info" />
    </div>
  );
};
