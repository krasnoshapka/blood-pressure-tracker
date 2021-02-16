import React, {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import {TextField} from "@material-ui/core";

const SettingsBasic = (props) => {
  const {settings, setSettings} = useContext(GlobalContext);

  const handleChange = (event) => {
    const newSettings = {...settings};
    newSettings[event.target.name] = event.target.value;
    setSettings(newSettings);
  };

  return (
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
    </React.Fragment>
  );
}

export default SettingsBasic;
