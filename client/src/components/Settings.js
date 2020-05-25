import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import { HOME_ROUTE } from "../constants/routes";

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
  uiProgess: {
    position: 'fixed',
    zIndex: '1000',
    height: '31px',
    width: '31px',
    left: '50%',
    top: '35%'
  },
  progess: {
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

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      uiLoading: true,
      buttonLoading: false,
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
          uiLoading: false
        });
      })
      .catch((error) => {
        if (error.response.status === 403) {
          this.props.history.push(`${HOME_ROUTE}/login`);
        }
        console.log(error);
        this.setState({ errorMsg: 'Error in retrieving the data' });
      });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  updateFormValues = (event) => {
    event.preventDefault();
    this.setState({ buttonLoading: true });
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    const formRequest = {
      email: this.state.email
    };
    axios
      .post('/user/settings', formRequest)
      .then(() => {
        this.setState({ buttonLoading: false });
      })
      .catch((error) => {
        if (error.response.status === 403) {
          this.props.history.push(`${HOME_ROUTE}/login`);
        }
        console.log(error);
        this.setState({ buttonLoading: false });
      });
  };

  render() {
    const { classes, ...rest } = this.props;
    if (this.state.uiLoading === true) {
      return (
        <React.Fragment>
          {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
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
                    {this.state.email}
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
                      value={this.state.email}
                      onChange={this.handleChange}
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
            onClick={this.updateFormValues}
            disabled={
              this.state.buttonLoading ||
              !this.state.email
            }
          >
            Save details
            {this.state.buttonLoading && <CircularProgress size={30} className={classes.progess} />}
          </Button>
        </React.Fragment>
      );
    }
  }
}

export default withStyles(styles)(Settings);
