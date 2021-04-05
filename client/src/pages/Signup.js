import React, {useState} from 'react';

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

const SignupPage = (props) => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const {loading, error, signup} = useAuth();

  const handleChange = (event) => {
    let newUserData = {...userData};
    newUserData[event.target.name] = event.target.value;
    setUserData(newUserData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // LEGACY REST API
    // axios
    //   .post(`${API_ROUTE}/user/signup`, userData)
    //   .then((response) => {
    //     localStorage.setItem('AuthToken', `${response.data.token}`);
    //     props.history.push(HOME_ROUTE);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //   });

    signup(userData.email, userData.password, userData.confirmPassword).then((res) => {
      // Full page reload is done here because context in util/graphql.js needs to be updated with received auth token
      // before fetching user data
      if (res) {
        document.location.href = HOME_ROUTE;
      }
    });
  };

  const {classes} = props;
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
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          helperText={error && error.email}
          error={error && error.email ? true : false}
          onChange={handleChange}
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
          helperText={error && error.password}
          error={error && error.password ? true : false}
          onChange={handleChange}
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
          helperText={error && error.confirmPassword}
          error={error && error.confirmPassword ? true : false}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
          disabled={!userData.email || !userData.password}
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
