import React, { Component } from 'react';
import { ActionButton, Select } from '../Infrastructure';
import { post } from '../../services/fetch';

export class CreateScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      info: '',
      tournamentEditionId: 0,
      date: undefined,
      singleTeams: true,
      maleTeams: false,
      femaleTeams: false,
      mixedTeams: false,
      ageFrom: undefined,
      ageTo: undefined,
      maxPlayerCount: 32,
      registrationStart: undefined,
      registrationEnd: undefined,
      hasGroupPhase: false,
      errors: {}
    };
  }

  create() {
    this.setState({ errors: {} });
    return post('/schemes', this.state)
      .then(({ id }) => {
        this.setState({ id: id });
        this.props.onChange();
      })
      .catch(err => {
        console.log(err);
        this.setState({ errors: err });
        throw err;
      });
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
        <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
      </div>
      <div className="margin input">
        <div>Допълнителна информация</div>
        <textarea
          type="text"
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Издание</div>
        <Select url="/editions" onChange={id => this.setState({ tournamentEditionId: id })} />
        <div className="error">{this.state.errors.tournamentEditionId ? '*Задължително поле' : null}</div>
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
        <div className="error">{this.state.errors.mixedSingleTeams ? '*Схемата е за единични отбори' : null}</div>
        <div className="error">{this.state.errors.schemeType ? '*Поне едно от "Мъже", "Жени", "Смесено" трябва да бъде избрано' : null}</div>
      </div>
      <div className="margin input">
        <div>Възраст от</div>
        <input
          type="number" min="0"
          onChange={e => this.setState({ ageFrom: e.target.value })} />
        <div className="error">{this.state.errors.ageFromTo ? '*Неправилен интервал' : null}</div>
        <div className="error">{this.state.errors.ageFrom ? '*Невалидна стойност' : null}</div>
      </div>
      <div className="margin input">
        <div>Възраст до</div>
        <input
          type="number" min="0"
          onChange={e => this.setState({ ageTo: e.target.value })} />
        <div className="error">{this.state.errors.ageFromTo ? '*Неправилен интервал' : null}</div>
        <div className="error">{this.state.errors.ageTo ? '*Невалидна стойност' : null}</div>
      </div>
      <div className="margin input">
        <div>Брой играчи</div>
        <input
          type="number" min="4" max="128"
          value={this.state.maxPlayerCount}
          onChange={e => this.setState({ maxPlayerCount: e.target.value })} />
        <div className="error">{this.state.errors.maxPlayerCount ? '*Невалидна стойност' : null}</div>
      </div>
      <div className="margin input">
        <div>Дата на схемата</div>
        <input type="date"
          onChange={e => this.setState({ date: e.target.value })} />
        <div className="error">{this.state.errors.tournamentDate ? '*Датата е преди дата за регистрация' : null}</div>
        <div className="error">{this.state.errors.date ? '*Задължително поле' : null}</div>
      </div>
      <div className="margin input">
        <div>Начало на регистрациите</div>
        <input type="date"
          onChange={e => this.setState({ registrationStart: e.target.value })} />
        <div className="error">{this.state.errors.registrationStartEnd ? '*Неправилен интервал' : null}</div>
        <div className="error">{this.state.errors.registrationStart ? '*Задължително поле' : null}</div>
      </div>
      <div className="margin input">
        <div>Последна дата за регистрация</div>
        <input type="date"
          onChange={e => this.setState({ registrationEnd: e.target.value })} />
        <div className="error">{this.state.errors.registrationStartEnd ? '*Неправилен интервал' : null}</div>
        <div className="error">{this.state.errors.registrationEnd ? '*Задължително поле' : null}</div>
      </div>
      <div className="margin input">
        <label>
          <input type="checkbox"
            onChange={e => this.setState({ hasGroupPhase: !this.state.hasGroupPhase })} />
          Включване на групова фаза</label>
      </div>
      <ActionButton className="margin input"
        onSuccess={`/schemes/view/${this.state.id}`}
        onClick={() => this.create()}>Готово</ActionButton>
    </div>;
  }
}