import classNames from "classnames";
import { AppBar } from "../components/mui/Appbar";
import { Toolbar } from "../components/mui/Toolbar";
import { Typography } from "../components/mui/Typography";
import { jssCssRulesWithTheme } from "../utils/jss-css-rules";
import { Drawer } from "../components/mui/Drawer";
import { Divider } from "../components/mui/Divider";
import { List } from "../components/mui/List/List";
import { mailFolderListItems, otherMailFolderListItems } from "./data/tileData";
import { IconButton } from "../components/mui/IconButton";
import ChevronRightIcon from "../icons/src/ChevronRight";
import ChevronLeftIcon from "../icons/src/ChevronLeft";
import MenuIcon from "../icons/src/Menu";

const drawerWidth = 240;

const PermanentDrawer = props => {
  const styles = theme => ({
    root: {
      flexGrow: 1
    },
    appFrame: {
      height: 430,
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      width: "100%"
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    "appBar-left": {
      marginLeft: drawerWidth
    },
    "appBar-right": {
      marginRight: drawerWidth
    },
    drawerPaper: {
      position: "relative",
      width: drawerWidth
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3
    }
  });
  const anchor = "left";
  const classes = jssCssRulesWithTheme("PermanentDrawerDemo", props, styles);

  const drawer = (
    <Drawer
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
      anchor={anchor}
    >
      <div className={classes.toolbar} />
      <Divider />
      <List>{mailFolderListItems()}</List>
      <Divider />
      <List>{otherMailFolderListItems()}</List>
    </Drawer>
  );

  let before = null;
  let after = null;

  if (anchor === "left") {
    before = drawer;
  } else {
    after = drawer;
  }

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar
          position="absolute"
          className$={classNames(classes.appBar, classes[`appBar-${anchor}`])}
        >
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Permanent drawer
            </Typography>
          </Toolbar>
        </AppBar>
        {before}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography>
            {"You think water moves fast? You should see ice."}
          </Typography>
        </main>
        {after}
      </div>
    </div>
  );
};

function ClippedDrawer(props) {
  const styles = theme => ({
    root: {
      flexGrow: 1,
      height: 430,
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawerPaper: {
      position: "relative",
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      minWidth: 0 // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar
  });
  const classes = jssCssRulesWithTheme("ClippedDrawer", props, styles);

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className$={classes.appBar}>
        <Toolbar>
          <Typography variant="title" color="inherit" noWrap>
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <List>{mailFolderListItems()}</List>
        <Divider />
        <List>{otherMailFolderListItems()}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography noWrap>
          {"You think water moves fast? You should see ice."}
        </Typography>
      </main>
    </div>
  );
}

const PersistentDrawer = props => {
  const styles = theme => ({
    root: {
      flexGrow: 1
    },
    appFrame: {
      height: 430,
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      width: "100%"
    },
    appBar: {
      position: "absolute",
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    "appBarShift-left": {
      marginLeft: drawerWidth
    },
    "appBarShift-right": {
      marginRight: drawerWidth
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 20
    },
    hide: {
      display: "none"
    },
    drawerPaper: {
      position: "relative",
      width: drawerWidth
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    "content-left": {
      marginLeft: -drawerWidth
    },
    "content-right": {
      marginRight: -drawerWidth
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    "contentShift-left": {
      marginLeft: 0
    },
    "contentShift-right": {
      marginRight: 0
    }
  });
  const classes = jssCssRulesWithTheme("PersistentDrawer", props, styles);

  const { theme } = props;
  var anchor: any = "left";
  var open$ = false; //TODO props.open$

  const handleDrawerClose = () => {
    open$ = false;
  };
  const handleDrawerOpen = () => {
    open$ = true;
  };

  const drawer = (
    <Drawer
      variant="persistent"
      anchor={anchor}
      open$={open$}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>{mailFolderListItems()}</List>
      <Divider />
      <List>{otherMailFolderListItems()}</List>
    </Drawer>
  );

  let before = null;
  let after = null;

  if (anchor === "left") {
    before = drawer;
  } else {
    after = drawer;
  }

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar
          className$={classNames(classes.appBar, {
            [classes.appBarShift]: open$,
            [classes[`appBarShift-${anchor}`]]: open$
          })}
        >
          <Toolbar disableGutters={!open$}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className$={classNames(classes.menuButton, open$ && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Persistent drawer
            </Typography>
          </Toolbar>
        </AppBar>
        {before}
        <main
          className={classNames(classes.content, classes[`content-${anchor}`], {
            [classes.contentShift]: open$,
            [classes[`contentShift-${anchor}`]]: open$
          })}
        >
          <div className={classes.drawerHeader} />
          <Typography>
            {"You think water moves fast? You should see ice."}
          </Typography>
        </main>
        {after}
      </div>
    </div>
  );
};

export const DrawersPage = props => {
  return (
    <div>
      <h2>Drawers</h2>
      {/* <PermanentDrawer />
      <br />
      <ClippedDrawer /> */}
      <br />
      <PersistentDrawer />
    </div>
  );
};
