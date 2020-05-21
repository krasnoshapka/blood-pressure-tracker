import React, { Component } from 'react';
import axios from 'axios';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import Settings from '../components/Settings';
import Records from '../components/Records';

import { authMiddleWare } from '../util/auth';

import { HOME_ROUTE } from "../constants/routes";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20
  },
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%'
  },
  toolbar: theme.mixins.toolbar
});

class HomePage extends Component {
  state = {
    render: false
  };

  loadSettingsPage = (event) => {
    this.setState({ render: true });
  };

  loadRecordsPage = (event) => {
    this.setState({ render: false });
  };

  logoutHandler = (event) => {
    localStorage.removeItem('AuthToken');
    this.props.history.push(`${HOME_ROUTE}/login`);
  };

  constructor(props) {
    super(props);

    this.state = {
      uiLoading: true,
    };
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
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.toolbar} />
            <Divider />
              <Avatar className={classes.avatar} />
              <p>
                {' '}
                {this.state.email}
              </p>
            <Divider />
            <List>
              <ListItem button key="Records" onClick={this.loadRecordsPage}>
                <ListItemIcon>
                  {' '}
                  <NotesIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Pressure" />
              </ListItem>

              <ListItem button key="Settings" onClick={this.loadSettingsPage}>
                <ListItemIcon>
                  {' '}
                  <AccountBoxIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>

              <ListItem button key="Logout" onClick={this.logoutHandler}>
                <ListItemIcon>
                  {' '}
                  <ExitToAppIcon />{' '}
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>

          <div>{this.state.render ? <Settings /> : <Records />}</div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(HomePage);
