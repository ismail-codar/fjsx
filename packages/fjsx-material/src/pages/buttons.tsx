import fjsx from "@fjsx/runtime";

import createMuiTheme, { Theme } from "../styles/createMuiTheme";
import purple from "../colors/purple";
import green from "../colors/green";

import { Button } from "../components/mui/Button";
import { IconButton } from "../components/mui/IconButton";
import { Icon } from "../components/mui/Icon";
import { jssCssRulesWithTheme } from "../utils/jss-css-rules";

import AddIcon from "../icons/src/Add";
import DeleteIcon from "../icons/src/Delete";
// import Icon from "../components/mui/Icon";

const styles = (theme: Theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  cssRoot: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700]
    }
  },
  bootstrapRoot: {
    boxShadow: "none",
    textTransform: "none",
    borderRadius: 4,
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc"
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf"
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)"
    }
  }
});

export const ButtonsPage = props => {
  const classes: any = jssCssRulesWithTheme("RaisedButtons", props, styles);

  // const theme2 = createMuiTheme({
  //   palette: {
  //     primary: green
  //   }
  // });

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
        variant="fab"
        color="secondary"
        aria-label="edit"
        className={classes.button}
        mini
      >
        <Icon>edit_icon</Icon>
      </Button>
      <IconButton
        className={classes.button}
        aria-label="Delete"
        disabled
        color="primary"
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        color="secondary"
        className={classes.button}
        aria-label="Add an alarm"
      >
        <Icon>alarm</Icon>
      </IconButton>
      <Button className={classes.button} variant="raised" color="primary">
        Send
        <Icon className={classes.rightIcon}>send</Icon>
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
      <Button
        variant="raised"
        color="primary"
        className={classes.button}
        classes={{
          root: classes.cssRoot
        }}
      >
        Custom CSS
      </Button>
      {/* <fjsx.Context key="theme" value={theme2}>
        <Button variant="raised" color="primary" className={classes.button}>
          MuiThemeProvider
        </Button>
      </fjsx.Context> */}
      <Button
        variant="raised"
        color="primary"
        className={classes.button}
        disableRipple
        classes={{
          root: classes.bootstrapRoot
        }}
      >
        Bootstrap
      </Button>
    </div>
  );
};
