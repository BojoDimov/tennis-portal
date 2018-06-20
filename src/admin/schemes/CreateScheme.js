import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, Select } from '../Infrastructure';
import { get, post } from '../../services/fetch';

export class CreateScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      singleTeams: true,
      maleTeams: false,
      femaleTeams: false,
      mixedTeams: false,
      hasGroupPhase: false,
      schemeType: 'elimination',
      pPoints: 1,
      wPoints: 15,
      cPoints: 20,
      errors: {}
    };
  }

  componentDidMount() {
    let tournamentEditionId = new URLSearchParams(this.props.location.search).get('editionId');
    get(`/editions/${tournamentEditionId}`)
      .then(edition => this.setState({
        tournamentEditionName: edition.name,
        tournamentEditionId: tournamentEditionId
      }));
  }

  create() {
    this.setState({ errors: {} });
    return post('/schemes', this.state, 'Схемата е успешно създадена')
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
    return <div className="form-container">
      <h2 className="form-box">Добавяне на схема</h2>
      <form className="form-box">
        <div className="input-group">
          <Link to={`/editions/view/${this.state.tournamentEditionId}`}>
            {this.state.tournamentEditionName}
          </Link>
        </div>

        <div className="input-group">
          <div>Име на схемата</div>
          <input
            type="text"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })} />
          <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
        </div>

        <div className="input-group">
          <div>Допълнителна информация</div>
          <textarea
            type="text"
            value={this.state.info}
            onChange={e => this.setState({ info: e.target.value })} />
        </div>

        <div className="input-group">
          <div>Формат</div>{this.state.singleTeams}
          <select onChange={(e) => this.setState({ singleTeams: e.target.value == 'true' ? true : false, mixedTeams: false })}>
            <option value={true}>Единични отбори</option>
            <option value={false}>Двойки</option>
          </select>
        </div>

        <div className="input-group">
          <div>
            <label>
              <input type="checkbox"
                onChange={e => this.setState({ maleTeams: !this.state.maleTeams })} />
              Мъже</label>
          </div>
          <div>
            <label>
              <input type="checkbox"
                onChange={e => this.setState({ femaleTeams: !this.state.femaleTeams })} />
              Жени</label>
          </div>
          {!this.state.singleTeams ? <div className="fade-in">
            <label>
              <input type="checkbox"
                onChange={e => this.setState({ mixedTeams: !this.state.mixedTeams })} />
              Микс</label>
          </div> : null}
          <div className="error">{this.state.errors.mixedSingleTeams ? '*Схемата е за единични отбори' : null}</div>
          <div className="error">{this.state.errors.schemeFormat ? '*Поне едно от "Мъже", "Жени", "Микс" трябва да бъде избрано' : null}</div>
        </div>

        <div className="input-group">
          <div>Тип на схемата</div>
          <select value={this.state.schemeType} onChange={(e) => this.setState({
            schemeType: e.target.value,
            maxPlayerCount: undefined,
            groupPhaseId: undefined,
            groupCount: undefined,
            teamsPerGroup: undefined
          })}>
            <option value="elimination">Елиминации</option>
            <option value="round-robin">Групова фаза</option>
          </select>
        </div>

        {this.state.schemeType == 'elimination' ?
          <div className="input-group">
            <div>Брой играчи</div>
            <input
              type="number" min="4" max="128"
              onChange={e => this.setState({ maxPlayerCount: e.target.value })} />
            <div className="error">{this.state.errors.eTeamCount ? '*Задължително поле' : null}</div>
          </div> : null
        }

        {this.state.schemeType == 'elimination' ?
          <div className="input-group">
            <label>
              <input type="checkbox"
                onChange={e => this.setState({ hasGroupPhase: !this.state.hasGroupPhase })} />
              Включване на групова фаза</label>
          </div> : null}

        {this.state.schemeType == 'elimination' && this.state.hasGroupPhase ?
          <div className="input-group">
            <div>Групова фаза</div>
            <Select url="/schemes" onChange={(e) => this.setState({ groupPhaseId: e.target.value })} />
            <div className="error">{this.state.errors.groupPhase ? '*Задължително поле' : null}</div>
          </div> : null}

        {this.state.schemeType == 'round-robin' ?
          <div>
            <div className="input-group">
              <div>Брой групи</div>
              <input type="number" onChange={(e) => this.setState({ groupCount: e.target.value })} />
              <div className="error">{this.state.errors.gCount ? '*Задължително поле' : null}</div>
            </div>
            <div className="input-group">
              <div>Брой играчи в група</div>
              <input type="number" onChange={(e) => this.setState({ teamsPerGroup: e.target.value })} />
              <div className="error">{this.state.errors.rrTeamCount ? '*Задължително поле' : null}</div>
            </div>
          </div> : null}

        <div className="input-group">
          <div>Възраст от</div>
          <input
            type="number" min="0"
            onChange={e => this.setState({ ageFrom: e.target.value })} />
          <div className="error">{this.state.errors.ageFromTo ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.ageFrom ? '*Невалидна стойност' : null}</div>
        </div>

        <div className="input-group">
          <div>Възраст до</div>
          <input
            type="number" min="0"
            onChange={e => this.setState({ ageTo: e.target.value })} />
          <div className="error">{this.state.errors.ageFromTo ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.ageTo ? '*Невалидна стойност' : null}</div>
        </div>

        <div className="input-group">
          <div>Дата на схемата</div>
          <input type="date"
            onChange={e => this.setState({ date: e.target.value })} />
          <div className="error">{this.state.errors.tournamentDate ? '*Датата е преди дата за регистрация' : null}</div>
          <div className="error">{this.state.errors.date ? '*Задължително поле' : null}</div>
        </div>

        <div className="input-group">
          <div>Начало на регистрациите</div>
          <input type="datetime-local"
            onChange={e => this.setState({ registrationStart: e.target.value })} />
          <div className="error">{this.state.errors.registrationStartEnd ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.registrationStart ? '*Задължително поле' : null}</div>
        </div>

        <div className="input-group">
          <div>Последна дата за регистрация</div>
          <input type="datetime-local"
            onChange={e => this.setState({ registrationEnd: e.target.value })} />
          <div className="error">{this.state.errors.registrationStartEnd ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.registrationEnd ? '*Задължително поле' : null}</div>
        </div>

        <div className="input-group">
          <div>Брой точки за участие</div>
          <input value={this.state.pPoints} type="number"
            onChange={e => this.setState({ pPoints: e.target.value })} />
        </div>

        <div className="input-group">
          <div>Брой точки за победа</div>
          <input value={this.state.wPoints} type="number"
            onChange={e => this.setState({ wPoints: e.target.value })} />
        </div>

        <div className="input-group">
          <div>Брой точки за шампион</div>
          <input value={this.state.cPoints} type="number"
            onChange={e => this.setState({ cPoints: e.target.value })} />
        </div>


        <ActionButton className="center"
          onSuccess={`/schemes/view/${this.state.id}`}
          onClick={() => this.create()}>
          Готово
          </ActionButton>

      </form>
    </div >;
  }
}