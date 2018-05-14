import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Tournaments } from './tournament/Tournaments';
import { CreateTournamentEdition } from './CreateTournamentEdition';
import { CreateTournamentScheme } from './CreateTournamentScheme';
import { CreateUser } from '../user/CreateUser';
import { LoginUser } from '../user/LoginUser';

export class Admin extends Component {
  render() {
    return <div className="content">
      <Switch>
        <Route exact path="/">
          <Redirect to="/tournaments" />
        </Route>
        <Route path="/tournaments" component={Tournaments} />
        <Route path="/editions" component={CreateTournamentEdition} />
        <Route path="/schemes" component={CreateTournamentScheme} />
        <Route path="/login" component={LoginUser} />
        <Route path="/register" component={CreateUser} />
      </Switch>
    </div>;
  }
}