import React, {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import {Grid, TextField} from "@material-ui/core";

const SettingsBasic = (props) => {
  const {settings, setSettings} = useContext(GlobalContext);

  const handleChange = (event) => {
    let newSettings = {...settings};
    newSettings[event.target.name] = event.target.value;
    setSettings(newSettings);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={6} xs={12}>
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
      </Grid>
    </Grid>
  );
}

export default SettingsBasic;
