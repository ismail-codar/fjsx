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
    <div>
      <TextField
        id="password-input"
        label="Password"
        className={classes.textField}
        type="password"
        autoComplete="current-password"
        margin="normal"
      />
    </div>
  );
};
