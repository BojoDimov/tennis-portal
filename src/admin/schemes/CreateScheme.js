import React, { Component } from 'react';
import { post } from '../../services/fetch';

export class CreateScheme extends Component {
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
    return <div className="margin container-fluid">
      <h2 className="section">Добавяне на схема</h2>
      <div className="margin input">
        <div>Име на схемата</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Допълнителна информация</div>
        <textarea
          type="text"
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin-left input">
        <label>
          <input type="checkbox"
            onChange={e => this.setState({ singleTeams: !this.state.singleTeams })} />
          Двойки</label>
      </div>
      <div className="margin-left input">
        <label>
          <input type="checkbox"
            onChange={e => this.setState({ maleTeams: !this.state.maleTeams })} />
          Мъже</label>
      </div>
      <div className="margin-left input">
        <label>
          <input type="checkbox"
            onChange={e => this.setState({ femaleTeams: !this.state.femaleTeams })} />
          Жени</label>
      </div>
      <div className="margin-left input">
        <label>
          <input type="checkbox"
            onChange={e => this.setState({ mixedTeams: !this.state.mixedTeams })} />
          Смесено</label>
      </div>
      <div className="margin input">
        <div>Възраст от</div>
        <input
          type="number" min="0"
          value={this.state.ageFrom}
          onChange={e => this.setState({ ageFrom: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Възраст до</div>
        <input
          type="number" min="0"
          value={this.state.ageTo}
          onChange={e => this.setState({ ageTo: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Брой играчи</div>
        <input
          type="number" min="4" max="128"
          value={this.state.maxPlayerCount}
          onChange={e => this.setState({ maxPlayerCount: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Дата на схемата</div>
        <input type="date"
          value={this.state.date}
          onChange={e => this.setState({ date: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Начало на регистрациите</div>
        <input type="date"
          value={this.state.registrationStart}
          onChange={e => this.setState({ registrationStart: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Последна дата за регистрация</div>
        <input type="date"
          value={this.state.registrationEnd}
          onChange={e => this.setState({ registrationEnd: e.target.value })} />
      </div>
      <div className="margin input">
        <label>
          <input type="checkbox"
            onChange={e => this.setState({ hasGroupPhase: !this.state.hasGroupPhase })} />
          Включване на групова фаза</label>
      </div>

      {/* {this.state.hasGroupPhase ?
        <div>
          <div>Предварителна регистрация за групова фаза</div>
          <input type="date"
            value={this.state.preRegistrationDate}
            onChange={e => this.setState({ preRegistrationDate: e.target.value })} />
        </div> : undefined
      } */}
      <div className="margin input">
        <span className="button" onClick={() => this.create()} disabled={!this.validate()}>Готово</span>
      </div>
    </div>;
  }

  create() {
    // return post('/tournament/edition/schemes', this.state)
    //   .then(res => console.log(res));
  }

  validate() {
    return true;
  }
}