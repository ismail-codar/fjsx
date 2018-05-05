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
  const selectedCurrency$ = "EUR";

  const currencies = [
    {
      value: "USD",
      label: "$"
    },
    {
      value: "EUR",
      label: "€"
    },
    {
      value: "BTC",
      label: "฿"
    },
    {
      value: "JPY",
      label: "¥"
    }
  ];

  const handleChange = name => {
    return null;
  };

  const classes = jssCssRulesWithTheme("TextFieldsPage", props, styles);
  return (
    <div className={classes.container}>
      <TextField
        id="password-input"
        label="Password"
        className$={classes.textField}
        type="password"
        autoComplete="current-password"
        // value$={"1111"}
        margin="normal"
      />
      <TextField
        required
        label="Error"
        error$
        className$={classes.textField}
        type="text"
        value$={"1111"}
        margin="normal"
      />
      <TextField
        id="multiline-flexible"
        label="Multiline"
        multiline
        rowsMax="4"
        className$={classes.textField}
        margin="normal"
      />
      <TextField
        id="full-width"
        label="Label"
        InputLabelProps={{}}
        placeholder="Placeholder"
        helperText$="Full width!"
        error$={true}
        FormHelperTextProps={{ error$: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        id="select-currency-native"
        select
        label="Native select"
        className$={classes.textField}
        value$={selectedCurrency$}
        onChange={handleChange("currency")}
        SelectProps={{
          native: true,
          MenuProps: {
            className$: classes.menu
          }
        }}
        helperText$="Please select your currency"
        margin="normal"
      >
        {currencies.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>
    </div>
  );
};
