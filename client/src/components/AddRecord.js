import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';

const styles = ((theme) => ({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    form: {
      width: '98%',
      marginLeft: 13,
      marginTop: theme.spacing(3)
    }
  })
);

class AddRecord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sys: '',
      dia: '',
      pul: '',
      errors: []
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = (event) => {
    authMiddleWare(this.props.history);
    event.preventDefault();
    const newRecord = {
      sys: this.state.sys,
      dia: this.state.dia,
      pul: this.state.pul
    };

    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post('/records', newRecord)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        this.setState({ errors: error.response.data });
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <main className={classes.content}>
        <Typography paragraph>
          Enter your pressure
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="sys"
                label="Systolic"
                name="sys"
                autoComplete="Systolic"
                helperText={errors.sys}
                value={this.state.sys}
                error={errors.sys ? true : false}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="dia"
                label="Diastolic"
                name="dia"
                autoComplete="Diastolic"
                helperText={errors.dia}
                value={this.state.dia}
                error={errors.dia ? true : false}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="pul"
                label="Pulse"
                name="pul"
                autoComplete="Pulse"
                helperText={errors.pul}
                value={this.state.pul}
                error={errors.pul ? true : false}
                onChange={this.handleChange}
              />
            </Grid>
           <Grid item xs={12}>
              <Button variant="contained" color="primary" size="large" onClick={this.handleSubmit} startIcon={<SaveIcon />} >Save</Button>
            </Grid>
          </Grid>
        </form>
      </main>
    )
  }
}

export default (withStyles(styles)(AddRecord));
