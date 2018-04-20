import { jssCssRulesWithTheme } from "../utils/jss-css-rules";
import { Divider } from "../components/mui/Divider";
import InboxIcon from "../icons/src/Inbox";
import DraftsIcon from "../icons/src/Drafts";
import { Avatar } from "../components/mui/Avatar";
import ImageIcon from "../icons/src/Image";
import WorkIcon from "../icons/src/Work";
import BeachAccessIcon from "../icons/src/BeachAccess";
import StarIcon from "../icons/src/Star";
import { Collapse } from "../transitions/Collapse";
import SendIcon from "../icons/src/Send";
import ExpandLess from "../icons/src/ExpandLess";
import ExpandMore from "../icons/src/ExpandMore";
import StarBorder from "../icons/src/StarBorder";
import { List } from "../components/mui/List/List";
import { ListItem } from "../components/mui/List/ListItem";
import { ListItemIcon } from "../components/mui/List/ListItemIcon";
import { ListItemText } from "../components/mui/List/ListItemText";
import { ListSubheader } from "../components/mui/List/ListSubheader";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

function SimpleList(props) {
  const classes = jssCssRulesWithTheme("SimpleList", props, styles);
  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav">
        <ListItem button>
          <ListItemText primary="Trash" />
        </ListItem>
        <ListItem button component="a" href="#simple-list">
          <ListItemText primary="Spam" />
        </ListItem>
      </List>
    </div>
  );
}

function FolderList(props) {
  const classes = jssCssRulesWithTheme("SimpleList", props, styles);
  return (
    <div className={classes.root}>
      <List>
        <ListItem>
          <Avatar>
            <ImageIcon />
          </Avatar>
          <ListItemText primary="Photos" secondary="Jan 9, 2014" />
        </ListItem>
        <ListItem>
          <Avatar>
            <WorkIcon />
          </Avatar>
          <ListItemText primary="Work" secondary="Jan 7, 2014" />
        </ListItem>
        <ListItem>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
          <ListItemText primary="Vacation" secondary="July 20, 2014" />
        </ListItem>
      </List>
    </div>
  );
}

function InsetList(props) {
  const classes = jssCssRulesWithTheme("SimpleList", props, styles);
  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText inset primary="Chelsea Otakan" />
        </ListItem>
        <ListItem button>
          <ListItemText inset primary="Eric Hoffman" />
        </ListItem>
      </List>
    </div>
  );
}

function NestedList(props) {
  const classes = jssCssRulesWithTheme("SimpleList", props, styles);

  var open$ = null;
  const handleClick = e => {
    open$ = !open$;
  };

  return (
    <div className={classes.root}>
      <List
        component="nav"
        subheader={
          <ListSubheader component="div">Nested List Items</ListSubheader>
        }
      >
        <ListItem button>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText inset primary="Sent mail" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Drafts" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText inset primary="Inbox" />
          {open$ ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse open$={open$} timeout="auto">
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText inset primary="Starred" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export const ListPage = props => {
  return (
    <div>
      <h2>Simple</h2>
      <SimpleList />
      <h2>Folder List</h2>
      <FolderList />
      <h2>Inset</h2>
      <InsetList />
      <h2>Nested</h2>
      <NestedList />
    </div>
  );
};
