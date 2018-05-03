import React, { Component } from 'react';

export class CreateTournament extends Component {
  render() {
    return <div>
      Create tournament component
      <div>
        <span>Наименование на турнира</span>
        <input type="text" />
      </div>
      <div>
        <span>Описание</span>
        <input type="text" />
      </div>
    </div>;
  }
}