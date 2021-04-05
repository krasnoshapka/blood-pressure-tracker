import React, { useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
});

const Settings = ({classes}) => {
  const [expanded, setExpanded] = useState('basic');

  const handleChange = (panel) => (event, isExpanded) => {
    isExpanded && setExpanded(panel);
  };

  return (
    <form autoComplete="off" noValidate className={classes.form}>
      <Typography gutterBottom>
        Settings
      </Typography>

      <Accordion expanded={expanded === 'basic'} onChange={handleChange('basic')} className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="basicbh-content"
          id="basicbh-header"
        >
          <Typography className={classes.heading}>General Settings</Typography>
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

    </form>
  );
}

export default withStyles(styles)(Settings);
