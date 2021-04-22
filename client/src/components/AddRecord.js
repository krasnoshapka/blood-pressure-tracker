import React from 'react';
import {useFormik} from "formik";
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import {useRecords} from "../context/RecordsContext";

const styles = ((theme) => ({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    submit: {
      marginTop: theme.spacing(3),
    }
  })
);

const AddRecord = ({classes, history, setPage}) => {
  const {add, errors: serverErrors} = useRecords();
  const {getFieldProps, handleSubmit, errors: clientErrors} = useFormik({
    initialValues: {
      sys: '',
      dia: '',
      pul: ''
    },
    validate(values) {
      const errors = {};

      for (let key in values) {
        if (!values[key]) {
          errors[key] = 'Required';
        } else if (values[key] < 40 || values[key] > 255) {
          errors[key] = 'Must be between 40 and 250';
        }
      }

      return errors;
    },
    onSubmit(values) {
      add({
        sys: parseInt(values.sys),
        dia: parseInt(values.dia),
        pul: parseInt(values.pul)
      }).then((res) => {
        if (res) {
          setPage('pressure');
        }
      });
    }
  });
  const errors = Object.keys(clientErrors).length > 0 ? clientErrors : serverErrors;

  return (
    <form className={classes.form} noValidate>
      <Typography paragraph>
        Enter your pressure
      </Typography>
      <TextField
        variant="outlined"
        required
        type="number"
        fullWidth
        margin="normal"
        id="sys"
        label="Systolic"
        name="sys"
        autoComplete="Systolic"
        helperText={errors && errors.sys}
        {...getFieldProps("sys")}
        error={errors && errors.sys ? true : false}
      />
      <TextField
        variant="outlined"
        required
        type="number"
        fullWidth
        margin="normal"
        id="dia"
        label="Diastolic"
        name="dia"
        autoComplete="Diastolic"
        helperText={errors && errors.dia}
        {...getFieldProps("dia")}
        error={errors && errors.dia ? true : false}
      />
      <TextField
        variant="outlined"
        required
        type="number"
        fullWidth
        margin="normal"
        id="pul"
        label="Pulse"
        name="pul"
        autoComplete="Pulse"
        helperText={errors && errors.pul}
        {...getFieldProps("pul")}
        error={errors && errors.pul ? true : false}
      />
      <Button variant="contained" color="primary" size="large" onClick={handleSubmit}
        startIcon={<SaveIcon />} className={classes.submit}>Save</Button>
    </form>
  )
}

export default (withStyles(styles)(AddRecord));
