import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { CreateTournament } from './CreateTournament';
import { CreateTournamentEdition } from './CreateTournamentEdition';
import { CreateTournamentScheme } from './CreateTournamentScheme';

export class Admin extends Component {
  render() {
    return <div className="content">
      <Switch>
        <Route path="/tournaments" component={CreateTournament} />
        <Route path="/editions" component={CreateTournamentEdition} />
        <Route path="/schemes" component={CreateTournamentScheme} />
      </Switch>
    </div>;
  }
}