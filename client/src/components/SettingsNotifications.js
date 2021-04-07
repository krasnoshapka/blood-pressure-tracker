import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import NotificationItem from "./NotificationItem";
import {useUser} from "../context/UserContext";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1)
  },
});

const SettingsNotifications = ({classes}) => {
  const {user, startNotification} = useUser();
  const [add, setAdd] = useState(false);

  async function handleAdd() {
    if (await startNotification()) {
      setAdd(true);
    }
  }

  return (
    <React.Fragment>
      {add ?
        <NotificationItem add setAdd={setAdd} />
      :
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add notification
        </Button>
      }

      <div>
        {!user.notifications.length ?
          <Typography paragraph>
            You don't have any notifications yet. Use Add button to create one.
          </Typography>
        :
          user.notifications.map((notification) =>
            <NotificationItem key={notification.id} notification={notification} />
        )}
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(SettingsNotifications);
