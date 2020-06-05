import React, { useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import { API_ROUTE } from "../constants/routes";

const styles = ((theme) => ({
    form: {
      width: '98%',
      marginLeft: 13,
      marginTop: theme.spacing(3)
    }
  })
);

const AddRecord = (props) => {
  const [record, setRecord] = useState({
    sys: '',
    dia: '',
    pul: ''
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    let newRecord = {...record};
    newRecord[event.target.name] = event.target.value;
    setRecord(newRecord);
  };

  const handleSubmit = (event) => {
    authMiddleWare(props.history);
    event.preventDefault();
    const newRecord = {
      sys: record.sys,
      dia: record.dia,
      pul: record.pul
    };

    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .post(`${API_ROUTE}/records/`, newRecord)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        setErrors(error.response.data);
        console.log(error);
      });
  };

  const {classes} = props;

  return (
    <React.Fragment>
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
              value={record.sys}
              error={errors.sys ? true : false}
              onChange={handleChange}
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
              value={record.dia}
              error={errors.dia ? true : false}
              onChange={handleChange}
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
              value={record.pul}
              error={errors.pul ? true : false}
              onChange={handleChange}
            />
          </Grid>
         <Grid item xs={12}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit} startIcon={<SaveIcon />} >Save</Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  )
}

export default (withStyles(styles)(AddRecord));
