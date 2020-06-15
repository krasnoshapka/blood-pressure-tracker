import React, { useState, useContext } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import {GlobalContext} from "../context/GlobalState";
import { HOME_ROUTE, API_ROUTE } from "../constants/routes";

const styles = (theme) => ({
  details: {
    display: 'flex'
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  locationText: {
    paddingLeft: '15px'
  },
  buttonProperty: {
    position: 'absolute',
    top: '50%'
  },
  uiProgress: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%'
  },
  progress: {
    position: 'absolute'
  },
  uploadButton: {
    marginLeft: '8px',
    margin: theme.spacing(1)
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10
  },
  submitButton: {
    marginTop: '10px'
  }
});

const Settings = (props) => {
  const {settings, setSettings, setPage} = useContext(GlobalContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleChange = (event) => {
    let newSettings = {...settings}
    newSettings[event.target.name] = event.target.value
    setSettings(newSettings);
  };

  const updateFormValues = (event) => {
    event.preventDefault();
    setButtonLoading(true);
    authMiddleWare(props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const formRequest = {
      email: settings.email
    };
    axios
      .post(`${API_ROUTE}/user/settings`, formRequest)
      .then(() => {
        setButtonLoading(false);
        setPage('pressure');
      })
      .catch((error) => {
        if (error.response.status === 403) {
          props.history.push(`${HOME_ROUTE}/login`);
        }
        console.log(error);
        setButtonLoading(false);
      });
  };

  const { classes, ...rest } = props;
  if (settings === null || !settings) {
    return (
      <React.Fragment>Loading...</React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Card {...rest} className={clsx(classes.root, classes)}>
          <CardContent>
            <div className={classes.details}>
              <div>
                <Typography className={classes.locationText} gutterBottom variant="h4">
                  Settings for {settings.email}
                </Typography>
              </div>
            </div>
            <div className={classes.progress} />
          </CardContent>
          <Divider />
        </Card>

        <br />
        <Card {...rest} className={clsx(classes.root, classes)}>
          <form autoComplete="off" noValidate>
            <Divider />
            <CardContent>
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
            </CardContent>
            <Divider />
            <CardActions />
          </form>
        </Card>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          className={classes.submitButton}
          onClick={updateFormValues}
          disabled={buttonLoading || !settings.email}
        >
          Save details
          {buttonLoading && <CircularProgress size={30} className={classes.progress} />}
        </Button>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Settings);
