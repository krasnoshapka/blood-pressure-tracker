import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {GlobalProvider} from "./context/GlobalState";
import Header from "./components/Header";
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import {HOME_ROUTE} from './constants/routes';

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
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <GlobalProvider>
        <BrowserRouter>
          <Switch>
              <Route path={`${HOME_ROUTE}/`} exact component={HomePage} />
              <Route path={`${HOME_ROUTE}/login`} exact component={LoginPage} />
              <Route path={`${HOME_ROUTE}/signup`} exact component={SignupPage} />
            </Switch>
        </BrowserRouter>
      </GlobalProvider>
    </MuiThemeProvider>
  );
}

export default App;
