import React, { useState, useEffect } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
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
  const [settings, setSettings] = useState({email: ''});
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authMiddleWare(props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get(`${API_ROUTE}/user/`)
      .then((response) => {
        console.log(response.data);
        setSettings(response.data);
        setUiLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          props.history.push(`${HOME_ROUTE}/login`);
        }
        console.log(error);
        setErrorMsg('Error in retrieving the data');
      });
  }, []);

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
  if (uiLoading === true) {
    return (
      <React.Fragment>
        {uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Card {...rest} className={clsx(classes.root, classes)}>
          <CardContent>
            <div className={classes.details}>
              <div>
                <Typography className={classes.locationText} gutterBottom variant="h4">
                  {settings.email}
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
