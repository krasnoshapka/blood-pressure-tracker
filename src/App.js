import React from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AddPage from './pages/AddPage';
import SettingsPage from './pages/SettingsPage';
import {HOME_ROUTE} from './constants/routes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <h1>Blood pressure tracker</h1>
        </header>

        <section>
          <Switch>
            <Route path={HOME_ROUTE} exact component={HomePage} />
            <Route path={`${HOME_ROUTE}/add`} exact component={AddPage} />
            <Route path={`${HOME_ROUTE}/settings`} exact component={SettingsPage} />
          </Switch>
        </section>

        <footer className="App-footer">
          <nav>
            <ul className="menu">
              <li><Link to={HOME_ROUTE}>Home</Link></li>
              <li><Link to={`${HOME_ROUTE}/add`}>Add record</Link></li>
              <li><Link to={`${HOME_ROUTE}/settings`}>Settings</Link></li>
            </ul>
          </nav>
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
