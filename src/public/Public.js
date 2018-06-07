import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { LoginComponent } from '../user/LoginComponent';
import { RegistrationComponent } from '../user/RegistrationComponent';
import { AuthenticatedUser } from '../app/AuthenticatedUser';

export class Public extends React.Component {
  render() {
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
}