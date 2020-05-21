import React from 'react';
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import './App.css';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import AddPage from './pages/Add';
import SettingsPage from './pages/Settings';
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
      <BrowserRouter>
        {/*<header className="App-header">*/}
        {/*  <h1>Blood pressure tracker</h1>*/}
        {/*</header>*/}

        {/*<section className="ui top attached segment">*/}
          <Switch>
            <Route path={`${HOME_ROUTE}/`} exact component={HomePage} />
            <Route path={`${HOME_ROUTE}/login`} exact component={LoginPage} />
            <Route path={`${HOME_ROUTE}/signup`} exact component={SignupPage} />
            {/*<Route path={`${HOME_ROUTE}/add`} exact component={AddPage} />*/}
            {/*<Route path={`${HOME_ROUTE}/settings`} exact component={SettingsPage} />*/}
          </Switch>
        {/*</section>*/}

        {/*<footer>*/}
        {/*  <div className="ui bottom attached tabular menu">*/}
        {/*    <NavLink to={HOME_ROUTE} className="item" activeClassName="active" exact>Home</NavLink>*/}
        {/*    <NavLink to={`${HOME_ROUTE}/add`} className="item" activeClassName="active">Add record</NavLink>*/}
        {/*    <NavLink to={`${HOME_ROUTE}/settings`} className="item" activeClassName="active">Settings</NavLink>*/}
        {/*  </div>*/}
        {/*</footer>*/}
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
