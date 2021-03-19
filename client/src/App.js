import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {GlobalProvider} from "./context/GlobalState";
import Header from "./components/Header";
import SigninPage from './pages/Signin';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import {HOME_ROUTE, SIGNIN_ROUTE, SIGNUP_ROUTE, ROOT_ROUTE} from './constants/routes';
import { useUser } from './context/UserContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#FF5722',
      dark: '#d50000',
      contrastText: '#fff'
    }
  }
});

function App() {
  const user = useUser();
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <GlobalProvider>
        <BrowserRouter>
          <Switch>
            <Route path={ROOT_ROUTE} exact>
              {user ?
                <Redirect to={HOME_ROUTE} />
                :
                <Redirect to={SIGNIN_ROUTE} />
              }
            </Route>
            <Route path={HOME_ROUTE} exact component={HomePage} />
            <Route path={SIGNIN_ROUTE} exact component={SigninPage} />
            <Route path={SIGNUP_ROUTE} exact component={SignupPage} />
          </Switch>
        </BrowserRouter>
      </GlobalProvider>
    </MuiThemeProvider>
  );
}

export default App;
