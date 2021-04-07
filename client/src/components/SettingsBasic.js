import React, {useState} from "react";
import {Button, TextField} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";

import {useUser} from "../context/UserContext";

const styles = (theme) => ({
  submit: {
    marginTop: theme.spacing(3),
  },
  uiProgress: {
    position: 'absolute',
    zIndex: '1000',
    top: 'calc(50% - 75px)',
    left: 'calc(50% - 75px)'
  },
});

const SettingsBasic = ({classes}) => {
  const {loading, user} = useUser();
  const [settings, setSettings] = useState({
    email: user.email
  });

  function handleChange(event) {
    let newSettings = {...settings};
    newSettings[event.target.name] = event.target.value;
    setSettings(newSettings);
  }

  function updateSettings(event) {
    event.preventDefault();
    const formRequest = {
      email: user.email,
    };
    // TODO: update settings when there will be some settings
  }

  return (!user ?
    <CircularProgress size={150} className={classes.uiProgress} />
    :
    <React.Fragment>
      <TextField
        fullWidth
        label="Email"
        margin="dense"
        name="email"
        variant="outlined"
        disabled={true}
        value={settings.email}
        onChange={handleChange}
      />

      <Button
        color="primary"
        variant="contained"
        type="submit"
        className={classes.submit}
        onClick={updateSettings}
        disabled={loading || !user.email}
      >
        Save details
        {loading && <CircularProgress size={30} className={classes.uiProgress} />}
      </Button>
    </React.Fragment>
  );
}

export default withStyles(styles)(SettingsBasic);
