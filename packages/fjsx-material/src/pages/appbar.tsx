import { jssCssRulesWithTheme } from "../utils/jss-css-rules";
import { AppBar } from "../components/mui/Appbar";
import { Toolbar } from "../components/mui/Toolbar";
import { Typography } from "../components/mui/Typography";
import { Button } from "../components/mui/Button";
import { IconButton } from "../components/mui/IconButton";
import MenuIcon from "../icons/src/Menu";

const styles = {
  root: {
    flexGrow: 1,
    padding: 16
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

export const AppBarPage = props => {
  const classes = jssCssRulesWithTheme("AppBarPage", props, styles);
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Title
          </Typography>
        </Toolbar>
      </AppBar>
      <br />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Title
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
