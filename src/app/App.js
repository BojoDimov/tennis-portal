import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Admin } from '../admin/Admin';
import { LoginComponent } from '../user/LoginComponent';
import { RegistrationComponent } from '../user/RegistrationComponent';
import './App.css';

class App extends Component {
  render() {
    return (<LoginGuard />);
  }
}

const LoginGuard = () => {
  const flag = true;
  if (flag)
    return (<Admin />);
  else
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LoginComponent} />
        <Route path="/registration" component={RegistrationComponent} />
        <Route component={LoginComponent} />
      </Switch>
    );
}

export default App;
