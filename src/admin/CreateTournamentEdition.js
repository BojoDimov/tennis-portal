import React, { Component } from 'react';

export class CreateTournamentEdition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      info: '',
      players: 4,
      registrationStart: new Date(),
      registrationEnd: new Date(),
      tournamentDate: new Date(),
      hasGroupPhase: false,
      preRegistrationDate: new Date()
    }
  }

  render() {
    return <div className="margin border">
      <h4>Създаване на ново издание на турнир</h4>
      <div>
        <div>Наименование на изданието</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div>
        <div>Описание на изданието</div>
        <input
          type="text"
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>

      <div>
        <div>Брой играчи</div>
        <input
          type="number" min="4" max="128"
          value={this.state.players}
          onChange={e => this.setState({ players: e.target.value })} />
      </div>
      <div>
        <div>Начало на регистрациите</div>
        <input type="date"
          value={this.state.registrationStart}
          onChange={e => this.setState({ registrationStart: e.target.value })} />
      </div>
      <div>
        <div>Последна дата за регистрация</div>
        <input type="date"
          value={this.state.registrationEnd}
          onChange={e => this.setState({ registrationEnd: e.target.value })} />
      </div>
      <div>
        <div>Дата на турнира</div>
        <input type="date"
          value={this.state.tournamentDate}
          onChange={e => this.setState({ tournamentDate: e.target.value })} />
      </div>
      <div>
        <div>Включване на групова фаза</div>
        <input type="checkbox"
          onChange={e => this.setState({ hasGroupPhase: !this.state.hasGroupPhase })} />
      </div>
      {this.state.hasGroupPhase ?
        <div>
          <div>Предварителна регистрация за групова фаза</div>
          <input type="date"
            value={this.state.preRegistrationDate}
            onChange={e => this.setState({ preRegistrationDate: e.target.value })} />
        </div> : undefined
      }
      <div>
        <button onClick={() => this.create()} disabled={!this.validate()}>Готово</button>
      </div>
    </div>;
  }

  create() {
    let request = new Request('http://localhost:3100/tournament/edition/create', {
      method: 'POST',
      body: JSON.stringify(this.state)
    });

    fetch(request).then(res => console.log(res));
  }

  update() {

  }

  validate() {
    return true;
  }
}