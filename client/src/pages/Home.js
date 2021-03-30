import React, {useState} from 'react';

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

import {useAuth} from "../context/AuthContext";
import {SIGNIN_ROUTE} from "../constants/routes";

import {RecordsProvider} from "../context/RecordsContext";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: '100vh',
    margin: '64px 0'
  },
  content: {
    padding: theme.spacing(1)
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
  const [page, setPage] = useState('pressure');
  const {loading, logout, error: userError} = useAuth();
  // Redirect to signin page when token is expired or other error occurred.
  if (userError) {
    props.history.push(SIGNIN_ROUTE);
  }

  const handlePageChange = (event, newPage) => {
    if (newPage === 'logout') {
      logout();
      props.history.push(SIGNIN_ROUTE);
    }
    setPage(newPage);
  }

  // LEGACY REST API
  // useEffect(() => {
  //   const authToken = localStorage.getItem('AuthToken');
  //   axios.defaults.headers.common = { Authorization: `${authToken}` };
  //   axios
  //     .get(`${API_ROUTE}/user/`)
  //     .then((response) => {
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 403) {
  //         props.history.push(`${HOME_ROUTE}/login`)
  //       }
  //       console.log(error);
  //     });
  // }, []);

  const { classes } = props;
  // TODO: Fix errors in console due to passing missing props
  // Material-UI: The key `root` provided to the classes prop is not implemented in Records.
  const childProps = { ...props, setPage };

  return (
    <>
      <div className={classes.root}>
        {loading ? (
          <CircularProgress size={150} className={classes.uiProgress} />
        ) : (
          <div className={classes.content}>
            {(() => {
              switch (page) {
                case 'pressure': return <RecordsProvider><Records {...childProps} /></RecordsProvider>;
                case 'add': return <RecordsProvider><AddRecord {...childProps} /></RecordsProvider>;
                case 'settings': return <Settings {...childProps} />;
                default: return <>Page not found</>;
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
    </>
  );
}

export default withStyles(styles)(HomePage);
