import createMuiTheme, { Theme } from "./styles/createMuiTheme";
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

import { Button } from "./components/mui/Button";
import fjsx from "@fjsx/runtime";
import { jssCssRulesWithTheme } from "./utils/jss-css-rules";

import AddIcon from "./icons/src/Add";
// import Icon from "./components/mui/Icon";

const styles = (theme: Theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

function RaisedButtons(props) {
  const classes: any = jssCssRulesWithTheme("RaisedButtons", props, styles);

  return (
    <div>
      <Button className={classes.button}>Default</Button>
      <Button variant="raised" color="primary" className={classes.button}>
        Primary
      </Button>
      <Button variant="fab" color="secondary" className={classes.button}>
        <AddIcon />
      </Button>
      <Button
        variant="raised"
        color="secondary"
        disabled
        className={classes.button}
      >
        Disabled
      </Button>
      <input
        accept="image/*"
        className={classes.input}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="raised" component="span" className={classes.button}>
          Upload
        </Button>
      </label>
    </div>
  );
}

export const App = () => {
  var btnText$ = "Success";

  return (
    <>
      <fjsx.Context key="theme" value={theme}>
        <RaisedButtons />
      </fjsx.Context>
    </>
  );
};
