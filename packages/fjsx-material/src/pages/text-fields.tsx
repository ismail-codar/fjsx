import { TextField } from "../components/mui/TextField/TextField";
import { jssCssRulesWithTheme } from "../utils/jss-css-rules";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

export const TextFieldsPage = props => {
  const classes = jssCssRulesWithTheme("TextFieldsPage", props, styles);
  return (
    <div className={classes.container}>
      <TextField
        id="password-input"
        label="Password"
        className={classes.textField}
        type="password"
        autoComplete="current-password"
        // value$={"1111"}
        margin="normal"
      />
      <TextField
        label="Error"
        error$
        className={classes.textField}
        type="text"
        value$={"1111"}
        margin="normal"
      />
      <TextField
        id="multiline-flexible"
        label="Multiline"
        multiline
        rowsMax="4"
        className={classes.textField}
        margin="normal"
      />
    </div>
  );
};
