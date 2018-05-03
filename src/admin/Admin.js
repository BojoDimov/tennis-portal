import React, { Component } from 'react';
import { CreateTournament } from './CreateTournament';
import { CreateTournamentEdition } from './CreateTournamentEdition';

export class Admin extends Component {
  render() {
    return <div>
      <CreateTournament className="border" />
      <CreateTournamentEdition className="border" />
    </div>;
  }
}