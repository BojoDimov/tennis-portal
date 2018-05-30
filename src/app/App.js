import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Admin } from '../admin/Admin';
import { LoginComponent } from '../user/LoginComponent';
import { RegistrationComponent } from '../user/RegistrationComponent';
import { ProvideAuthenticatedUser, AuthenticatedUser } from './AuthenticatedUser';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticatedUser: {
        isLogged: JSON.parse(localStorage.getItem('token')) != null,
        change: this.initAuthenticatedUser.bind(this)
      }
    }
  }

  initAuthenticatedUser() {
    let token = JSON.parse(localStorage.getItem('token'));
    this.setState({
      authenticatedUser: {
        isLogged: token != null,
        change: this.initAuthenticatedUser.bind(this)
      }
    });
  }

  render() {
    return (
      <ProvideAuthenticatedUser value={this.state.authenticatedUser}>
        <LoginGuard isLogged={this.state.authenticatedUser.isLogged} />
      </ProvideAuthenticatedUser>
    );
  }
}

const LoginGuard = ({ isLogged }) => {
  if (isLogged)
    return (<Admin />);
  else
    return (
      <div className="public">
        <div className="left-sidebar"></div>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login" render={() =>
            <AuthenticatedUser>
              {({ change }) => <LoginComponent onChange={change} />}
            </AuthenticatedUser>} />
          <Route path="/registration" component={RegistrationComponent} />
          <Route render={() =>
            <AuthenticatedUser>
              {({ change }) => <LoginComponent onChange={change} />}
            </AuthenticatedUser>} />
        </Switch>
        <div className="right-sidebar"></div>
      </div>
    );
}

export default App;
