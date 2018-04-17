import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "../components/mui/List";
import { Divider } from "../components/mui/Divider";
import InboxIcon from "../icons/src/Inbox";
import DraftsIcon from "../icons/src/Drafts";
import { jssCssRulesWithTheme } from "../utils/jss-css-rules";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
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

export const ListPage = props => {
  return (
    <div>
      <SimpleList />
    </div>
  );
};
