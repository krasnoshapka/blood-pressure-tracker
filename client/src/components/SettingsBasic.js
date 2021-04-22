import React from "react";
import {useFormik} from "formik";
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
  const {getFieldProps, handleSubmit, errors} = useFormik({
    initialValues: {
      email: user.email
    },
    validate(values) {
      // TODO: validate settings
    },
    onSubmit(values) {
      const formRequest = {
        email: values.email,
      };
      // TODO: update settings when there will be some settings
      console.log(formRequest);
    }
  });

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
        {...getFieldProps("email")}
      />

      <Button
        color="primary"
        variant="contained"
        type="submit"
        className={classes.submit}
        onClick={handleSubmit}
        disabled={loading || !user.email}
      >
        Save details
        {loading && <CircularProgress size={30} className={classes.uiProgress} />}
      </Button>
    </React.Fragment>
  );
}

export default withStyles(styles)(SettingsBasic);
