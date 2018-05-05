// This file is shared across the demos.

import InboxIcon from "../../icons/src/MoveToInbox";
import DraftsIcon from "../../icons/src/Drafts";
import StarIcon from "../../icons/src/Star";
import SendIcon from "../../icons/src/Send";
import MailIcon from "../../icons/src/Mail";
import DeleteIcon from "../../icons/src/Delete";
import ReportIcon from "../../icons/src/Report";
import { ListItem } from "../../components/mui/List/ListItem";
import { ListItemIcon } from "../../components/mui/List/ListItemIcon";
import { ListItemText } from "../../components/mui/List/ListItemText";

export const mailFolderListItems = () => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary="Starred" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Send mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DraftsIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
    </ListItem>
  </div>
);

export const otherMailFolderListItems = () => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="All mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItem>
  </div>
);

// WEBPACK FOOTER //
// ./docs/src/pages/demos/drawers/tileData.js
