import React from 'react';
import {useFormik} from "formik";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import {HOME_ROUTE, SIGNUP_ROUTE} from '../constants/routes';
import {useAuth} from "../context/AuthContext";

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    display: 'inline-block'
  },
  progress: {
    position: 'absolute'
  }
});

const SigninPage = ({ classes }) => {
  const {loading, errors: serverErrors, signin} = useAuth();
  const {values, getFieldProps, handleSubmit, errors: clientErrors} = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate(values) {
      const errors = {};

      for (let key in values) {
        if (!values[key]) {
          errors[key] = 'Required';
        }
      }
      return errors;
    },
    onSubmit(values) {
      signin(values.email, values.password).then((res) => {
        // Full page reload is done here because context in util/graphql.js needs to be updated with received auth token
        // before fetching user data
        if (res) {
          document.location.href = HOME_ROUTE;
        }
      });
    }
  });
  const errors = Object.keys(clientErrors).length > 0 ? clientErrors : serverErrors;

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <form className={classes.form} noValidate>
        {errors && (
          <Typography variant="body2" className={classes.customError}>
            {errors.message}
          </Typography>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          {...getFieldProps("email")}
          helperText={errors && errors.email}
          error={errors && errors.email ? true : false}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          {...getFieldProps("password")}
          helperText={errors && errors.password}
          error={errors && errors.password ? true : false}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
          disabled={loading || !values.email || !values.password}
        >
          Sign In
          {loading && <CircularProgress size={30} className={classes.progress} />}
        </Button>
      </form>

      <div>
        <Link href={SIGNUP_ROUTE} variant="body2">
          {"Don't have an account? Sign Up"}
        </Link>
      </div>
    </Container>
  );
}

export default withStyles(styles)(SigninPage);
