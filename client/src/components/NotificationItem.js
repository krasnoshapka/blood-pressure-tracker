import React, {useState} from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import {weekDays} from "../constants/notification";
import {useUser} from "../context/UserContext";
import {defaultNotification} from "../constants/notification";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  weekday: {
    width: '45%',
  },
  timeField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    margin: theme.spacing(1)
  },
  delete: {
    alignSelf: 'flex-end',
    flex: '0 0 30px'
  }
});

const NotificationItem = ({add, setAdd, notification, classes}) => {
  const {addNotification, deleteNotification} = useUser();
  const [item, setItem] = useState(add ? defaultNotification : notification);

  function handleChange(event) {
    const newItem = {...item};
    if (event.target.name === "time") {
      newItem[event.target.name] = event.target.value;
    } else {
      newItem[event.target.name] = event.target.checked;
    }
    setItem(newItem);
  }

  function handleSave() {
    if (addNotification(item)) {
      setAdd(false);
    }
  }

  function handleDelete() {
    deleteNotification(item.id);
  }

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Select day(s) and time</FormLabel>
      <FormGroup>
        <Grid container justify="space-around" wrap="wrap">
          { weekDays.map(({name, title}) => (
            <FormControlLabel
              key={`${item.id}-${name}`}
              control={<Checkbox checked={item[name]} onChange={handleChange} name={name} />}
              label={title}
              className={classes.weekday}
            />
          ))}
        </Grid>
      </FormGroup>
      <TextField
        id="time"
        label="Time"
        type="time"
        name="time"
        defaultValue={item.time}
        className={classes.timeField}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
      {add && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save notification
        </Button>
      )}
      {item.id && (
        <IconButton
          aria-label="delete"
          size="small"
          variant="contained"
          className={classes.delete}
          color="primary"
          onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      )}
    </FormControl>
  );
}

export default withStyles(styles)(NotificationItem);
