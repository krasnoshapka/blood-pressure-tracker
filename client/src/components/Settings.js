import React, { useState, useContext } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Button} from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import axios from 'axios';
import {authMiddleWare} from '../util/auth';
import {GlobalContext} from "../context/GlobalState";
import {HOME_ROUTE, API_ROUTE} from "../constants/routes";
import SettingsBasic from "./SettingsBasic";
import SettingsNotifications from "./SettingsNotifications";

const styles = (theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  accordion: {
    width: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
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
      notifications: settings.notifications,
      notificationsToken: settings.notificationsToken
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

  return !settings ?
    (<CircularProgress size={150} className={classes.uiProgress} />)
  : (
    <form autoComplete="off" noValidate className={classes.form}>
      <Typography gutterBottom>
        Settings for {settings.email}
      </Typography>

      <Accordion expanded={expanded === 'basic'} onChange={handleChange('basic')} className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="basicbh-content"
          id="basicbh-header"
        >
          <Typography className={classes.heading}>General settings</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <SettingsBasic />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'notifications'} onChange={handleChange('notifications')} className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="notificationsbh-content"
          id="notificationsbh-header"
        >
          <Typography className={classes.heading}>Notifications</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <SettingsNotifications />
        </AccordionDetails>
      </Accordion>

      <Button
        color="primary"
        variant="contained"
        type="submit"
        className={classes.submit}
        onClick={updateFormValues}
        disabled={buttonLoading || !settings.email}
      >
        Save details
        {buttonLoading && <CircularProgress size={30} className={classes.progress} />}
      </Button>
    </form>
  );
}

export default withStyles(styles)(Settings);
