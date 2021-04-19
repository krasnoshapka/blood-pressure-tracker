import React from 'react';
import {useFormik} from "formik";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import {HOME_ROUTE, SIGNIN_ROUTE} from "../constants/routes";
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
  progress: {
    position: 'absolute'
  }
});

const SignupPage = ({classes}) => {
  const {loading, errors: serverErrors, signup} = useAuth();
  const {values, getFieldProps, handleSubmit, errors: clientErrors} = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate(values) {
      const errors = {};

      for (let key in values) {
        if (!values[key]) {
          errors[key] = 'Required';
        }
      }

      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (values.password != values.confirmPassword) {
        errors.password = "Passwords doesn't match";
        errors.confirmPassword = "Passwords doesn't match";
      }

      return errors;
    },
    onSubmit(values) {
      signup(values.email, values.password, values.confirmPassword).then((res) => {
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
        Sign up
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          type="email"
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          {...getFieldProps("email")}
          helperText={errors && errors.email}
          error={errors && errors.email}
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
          error={errors && errors.password}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
          {...getFieldProps("confirmPassword")}
          helperText={errors && errors.confirmPassword}
          error={errors && errors.confirmPassword}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
          disabled={!values.email || !values.password}
        >
          Sign Up
          {loading && <CircularProgress size={30} className={classes.progress} />}
        </Button>
      </form>
      <div>
        <Link href={SIGNIN_ROUTE} variant="body2">
          Already have an account? Sign in
        </Link>
      </div>
    </Container>
  );
}

export default withStyles(styles)(SignupPage);
