import React, { useState, useContext } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Button} from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import axios from 'axios';
import {authMiddleWare} from '../util/auth';
import {GlobalContext} from "../context/GlobalState";
import {HOME_ROUTE, API_ROUTE} from "../constants/routes";
import SettingsBasic from "./SettingsBasic";
import SettingsNotifications from "./SettingsNotifications";

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  details: {
    display: 'flex'
  },
  locationText: {
    paddingLeft: '15px'
  },
  progress: {
    position: 'absolute'
  },
  submitButton: {
    marginTop: '10px'
  }
});

const Settings = (props) => {
  const {settings, setPage} = useContext(GlobalContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const updateFormValues = (event) => {
    event.preventDefault();
    setButtonLoading(true);
    authMiddleWare(props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const formRequest = {
      email: settings.email,
      notifications: settings.notifications
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
      <div>Loading...</div>
    );
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.details}>
          <div>
            <Typography className={classes.locationText} gutterBottom variant="h4">
              Settings for {settings.email}
            </Typography>
          </div>
        </div>

        <form autoComplete="off" noValidate>
          <ExpansionPanel expanded={expanded === 'basic'} onChange={handleChange('basic')}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="basicbh-content"
              id="basicbh-header"
            >
              <Typography className={classes.heading}>General settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <SettingsBasic />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'notifications'} onChange={handleChange('notifications')}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="notificationsbh-content"
              id="notificationsbh-header"
            >
              <Typography className={classes.heading}>Notifications</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <SettingsNotifications />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </form>

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
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
