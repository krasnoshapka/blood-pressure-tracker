import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import AppBar from "@material-ui/core/AppBar";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import Settings from '../components/Settings';
import Records from '../components/Records';
import AddRecord from "../components/AddRecord";

import { authMiddleWare } from '../util/auth';
import {GlobalContext} from "../context/GlobalState";
import { HOME_ROUTE, API_ROUTE } from "../constants/routes";

const styles = (theme) => ({
  root: {
    position: 'relative',
    minHeight: '100vh',
    margin: '64px 0'
  },
  content: {
    padding: theme.spacing(2)
  },
  bottomBar: {
    top: 'auto',
    bottom: 0,
  },
  uiProgress: {
    position: 'absolute',
    zIndex: '1000',
    top: 'calc(50% - 75px)',
    left: 'calc(50% - 75px)'
  }
});

const HomePage = (props) => {
  const {page, setPage, setSettings} = useContext(GlobalContext);
  const [uiLoading, setUiLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePageChange = (event, newPage) => {
    if (newPage === 'logout') {
      localStorage.removeItem('AuthToken');
      props.history.push(`${HOME_ROUTE}/login`);
    }
    setPage(newPage);
  }

  useEffect(() => {
    authMiddleWare(props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get(`${API_ROUTE}/user/`)
      .then((response) => {
        setSettings(response.data);
        setUiLoading(false)
      })
      .catch((error) => {
        if (error.response.status === 403) {
          props.history.push(`${HOME_ROUTE}/login`)
        }
        console.log(error);
        setErrorMsg('Error in retrieving the data');
      });
  }, []);

  const { classes } = props;

  return (
    <React.Fragment>
      <div className={classes.root}>
        {uiLoading ? (
          <CircularProgress size={150} className={classes.uiProgress} />
        ) : (
          <div className={classes.content}>
            {(() => {
              switch (page) {
                case 'pressure': return <Records />;
                case 'add': return <AddRecord />;
                case 'settings': return <Settings />;
                default: return;
              }
            })()}
          </div>
        )}
      </div>
      <AppBar position="fixed" className={classes.bottomBar}>
        <BottomNavigation value={page} onChange={handlePageChange} className={classes.bottomMenu}>
          <BottomNavigationAction label="Pressure" value="pressure" icon={<NotesIcon />} />
          <BottomNavigationAction label="Add" value="add" icon={<AddCircleIcon />} />
          <BottomNavigationAction label="Settings" value="settings" icon={<AccountBoxIcon />} />
          <BottomNavigationAction label="Logout" value="logout" icon={<ExitToAppIcon />} />
        </BottomNavigation>
      </AppBar>
    </React.Fragment>
  );
}

export default withStyles(styles)(HomePage);
