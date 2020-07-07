import React, {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import {defaultNotification} from "../constants/notification";
import NotificationItem from "./NotificationItem";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import messaging from "../util/firebase";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(1),
  },
});

const SettingsNotifications = (props) => {
  const {settings, setSettings} = useContext(GlobalContext);

  const handleAddNotification = (event) => {
    const notifications = settings.notifications;

    messaging.requestPermission()
      .then(() => {
        return messaging.getToken();
      })
      .then((notificationsToken) => {
        notifications.push({
          ...defaultNotification,
          id: new Date()
        });
        setSettings({
          ...settings,
          notifications,
          notificationsToken
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const { classes, ...rest } = props;
  const AddButton = (
    <Button
      variant="contained"
      color="primary"
      size="small"
      className={classes.button}
      startIcon={<AddIcon />}
      onClick={handleAddNotification}
    >
      Add notification
    </Button>
  );

  if (settings.notifications.length === 0) {
    return (
      <div>
        {AddButton}
        <br />
        You don't have any notifications yet. Use Add button to create one.
      </div>
    );
  } else {
    return (
      <div>
        {AddButton}
        <br />
        <Grid container spacing={1}>
          {settings.notifications.map((notification) => {
            return (
              <NotificationItem key={notification.id} notification={notification} />
            );
          })}
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(SettingsNotifications);
