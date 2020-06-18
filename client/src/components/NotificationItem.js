import React, {useContext} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@material-ui/core";
import {weekDays} from "../constants/notification";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import {GlobalContext} from "../context/GlobalState";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  timeField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  }
});

const NotificationItem = ({notification, classes}) => {
  const {settings, setSettings} = useContext(GlobalContext);

  const handleChange = (event) => {
    let newNotifications = settings.notifications.map((n) => {
      if (n.id !== notification.id) {
        return n;
      }
      if (event.target.name === "time") {
        n[event.target.name] = event.target.value;
      } else {
        n[event.target.name] = event.target.checked;
      }
      return n;
    });

    setSettings({...settings,
      notifications: newNotifications
    });
  };

  const handleDelete = (event) => {
    let newNotifications = settings.notifications.filter((n) =>
      n.id !== notification.id
    );

    setSettings({...settings,
      notifications: newNotifications
    });
  };

  return (
    <Grid item xs={12}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select day(s) and time</FormLabel>
        <FormGroup>
          <Grid container justify="space-around">
            { weekDays.map(({name, title}) => {
                return (
                  <FormControlLabel
                    key={`${notification.id}-${name}`}
                    control={<Checkbox checked={notification[name]} onChange={handleChange} name={name} />}
                    label={title}
                  />
                );
              }) }
          </Grid>
        </FormGroup>
        <TextField
          id="time"
          label="Time"
          type="time"
          defaultValue="07:30"
          className={classes.timeField}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        <IconButton
          aria-label="delete"
          size="small"
          variant="contained"
          color="primary"
          onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </FormControl>
    </Grid>
  );
}

export default withStyles(styles)(NotificationItem);
