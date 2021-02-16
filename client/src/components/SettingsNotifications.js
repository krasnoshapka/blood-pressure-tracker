import React, {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import {defaultNotification} from "../constants/notification";
import NotificationItem from "./NotificationItem";
import withStyles from "@material-ui/core/styles/withStyles";
import messaging from "../util/firebase";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1)
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

  return (
    <React.Fragment>
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

      <div>
        {!settings.notifications.length ? (
          <Typography paragraph>
            You don't have any notifications yet. Use Add button to create one.
          </Typography>
        ) : settings.notifications.map((notification) =>
          (
            <NotificationItem key={notification.id} notification={notification} />
          )
        )}
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(SettingsNotifications);
