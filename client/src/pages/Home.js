import React, { Component } from 'react';
import axios from 'axios';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import Settings from '../components/Settings';
import Records from '../components/Records';

import { authMiddleWare } from '../util/auth';

import { HOME_ROUTE } from "../constants/routes";

const styles = (theme) => ({
  root: {
  },
  content: {
    padding: theme.spacing(3)
  },
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%'
  },
});

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uiLoading: true,
      page: 'pressure'
    };
  }

  handlePageChange = (event, newPage) => {
    if (newPage == 'logout') {
      localStorage.removeItem('AuthToken');
      this.props.history.push(`${HOME_ROUTE}/login`);
    }
    console.log('SET ' + newPage);
    this.setState({ page: newPage });
  }

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get('/user')
      .then((response) => {
        console.log(response.data);
        this.setState({
          email: response.data.email,
          uiLoading: false,
        });
      })
      .catch((error) => {
        if (error.response.status === 403) {
          this.props.history.push(`${HOME_ROUTE}/login`)
        }
        console.log(error);
        this.setState({ errorMsg: 'Error in retrieving the data' });
      });
  };

  render() {
    const { classes } = this.props;
    if (this.state.uiLoading === true) {
      return (
        <div className={classes.root}>
          {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <div className={classes.content}>
            {(() => {
              switch (this.state.page) {
                case 'pressure': return <Records />;
                case 'settings': return <Settings />;
              }
            })()}
          </div>
          <BottomNavigation value={this.state.page} onChange={this.handlePageChange}>
            <BottomNavigationAction label="Pressure" value="pressure" icon={<NotesIcon />} />
            <BottomNavigationAction label="Settings" value="settings" icon={<AccountBoxIcon />} />
            <BottomNavigationAction label="Logout" value="logout" icon={<ExitToAppIcon />} />
          </BottomNavigation>
        </div>
      );
    }
  }
}

export default withStyles(styles)(HomePage);
