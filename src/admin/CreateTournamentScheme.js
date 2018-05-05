import React, { Component } from 'react';

export class CreateTournamentScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      info: '',
      date: null,
      singleTeams: true,
      maleTeams: false,
      femaleTeams: false,
      mixedTeams: false,
      ageFrom: null,
      ageTo: null,
      maxPlayerCount: 32,
      registrationStart: null,
      registrationEnd: null,
      hasGroupPhase: false,
    };
  }

  render() {
    return <div className="margin border">
      <h4 className="margin">Добавяне на схема</h4>
      <div className="margin">
        <div>Име на схемата</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div className="margin">
        <div>Допълнителна информация</div>
        <input
          type="text"
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin">
        <div>Двойки</div>
        <input type="checkbox"
          onChange={e => this.setState({ singleTeams: !this.state.singleTeams })} />
      </div>
      <div className="margin">
        <div>Мъже</div>
        <input type="checkbox"
          onChange={e => this.setState({ maleTeams: !this.state.maleTeams })} />
      </div>
      <div className="margin">
        <div>Жени</div>
        <input type="checkbox"
          onChange={e => this.setState({ femaleTeams: !this.state.femaleTeams })} />
      </div>
      <div className="margin">
        <div>Смесено</div>
        <input type="checkbox"
          onChange={e => this.setState({ mixedTeams: !this.state.mixedTeams })} />
      </div>
      <div className="margin">
        <div>Възраст от</div>
        <input
          type="number" min="0"
          value={this.state.ageFrom}
          onChange={e => this.setState({ ageFrom: e.target.value })} />
      </div>
      <div className="margin">
        <div>Възраст до</div>
        <input
          type="number" min="0"
          value={this.state.ageTo}
          onChange={e => this.setState({ ageTo: e.target.value })} />
      </div>
      <div className="margin">
        <div>Брой играчи</div>
        <input
          type="number" min="4" max="128"
          value={this.state.maxPlayerCount}
          onChange={e => this.setState({ maxPlayerCount: e.target.value })} />
      </div>
      <div className="margin">
        <div>Дата на схемата</div>
        <input type="date"
          value={this.state.date}
          onChange={e => this.setState({ date: e.target.value })} />
      </div>
      <div className="margin">
        <div>Начало на регистрациите</div>
        <input type="date"
          value={this.state.registrationStart}
          onChange={e => this.setState({ registrationStart: e.target.value })} />
      </div>
      <div className="margin">
        <div>Последна дата за регистрация</div>
        <input type="date"
          value={this.state.registrationEnd}
          onChange={e => this.setState({ registrationEnd: e.target.value })} />
      </div>
      <div className="margin">
        <div>Включване на групова фаза</div>
        <input type="checkbox"
          onChange={e => this.setState({ hasGroupPhase: !this.state.hasGroupPhase })} />
      </div>

      {/* {this.state.hasGroupPhase ?
        <div>
          <div>Предварителна регистрация за групова фаза</div>
          <input type="date"
            value={this.state.preRegistrationDate}
            onChange={e => this.setState({ preRegistrationDate: e.target.value })} />
        </div> : undefined
      } */}
      <div className="margin">
        <button onClick={() => this.create()} disabled={!this.validate()}>Готово</button>
      </div>
    </div>;
  }

  create() {
    let request = new Request('http://localhost:3100/api/tournament/edition/schemes', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    fetch(request).then(res => console.log(res));
  }

  validate() {
    return true;
  }
}