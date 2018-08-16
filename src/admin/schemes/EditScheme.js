import React, { Component } from 'react';
import { ActionButton, Select } from '../Infrastructure';
import { get, post } from '../../services/fetch';

export class EditScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      registrationStart: null,
      registrationEnd: null
    };
  }

  componentDidMount() {
    return get(`/schemes/${this.props.match.params.id}`)
      .then(res => {
        this.setState(res);
        this.setState({ errors: {} });
      });
  }

  update() {
    return post('/schemes/edit', this.state, 'Промяната е успешна')
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return <div className="form-container">
      <h2 className="form-box">Промяна на схема</h2>
      <form className="form-box">
        {/* <div className="input-group">
          <Link to={`/editions/view/${this.state.tournamentEditionId}`}>
            {this.state.tournamentEditionName}
          </Link>
        </div> */}

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
          <select value={this.state.singleTeams}
            onChange={(e) => this.setState({ singleTeams: e.target.value == 'true' ? true : false, mixedTeams: false })}>
            <option value={true}>Единични отбори</option>
            <option value={false}>Двойки</option>
          </select>
        </div>

        <div className="input-group">
          <div>
            <label>
              <input type="checkbox"
                checked={this.state.maleTeams}
                onChange={e => this.setState({ maleTeams: !this.state.maleTeams })} />
              Мъже</label>
          </div>
          <div>
            <label>
              <input type="checkbox"
                checked={this.state.femaleTeams}
                onChange={e => this.setState({ femaleTeams: !this.state.femaleTeams })} />
              Жени</label>
          </div>
          {!this.state.singleTeams ? <div className="fade-in">
            <label>
              <input type="checkbox"
                checked={this.state.mixedTeams}
                onChange={e => this.setState({ mixedTeams: !this.state.mixedTeams })} />
              Микс</label>
          </div> : null}
          <div className="error">{this.state.errors.mixedSingleTeams ? '*Схемата е за единични отбори' : null}</div>
          <div className="error">{this.state.errors.schemeType ? '*Поне едно от "Мъже", "Жени", "Микс" трябва да бъде избрано' : null}</div>
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
              value={this.state.maxPlayerCount}
              onChange={e => this.setState({ maxPlayerCount: e.target.value })} />
            <div className="error">{this.state.errors.eTeamCount ? '*Задължително поле' : null}</div>
          </div> : null
        }

        {this.state.schemeType == 'elimination' ?
          <div className="input-group">
            <label>
              <input type="checkbox"
                checked={this.state.hasGroupPhase}
                onChange={e => this.setState({ hasGroupPhase: !this.state.hasGroupPhase })} />
              Включване на групова фаза</label>
          </div> : null}

        {this.state.schemeType == 'elimination' && this.state.hasGroupPhase ?
          <div className="input-group">
            <div>Групова фаза</div>
            <Select value={this.state.groupPhaseId ? this.state.groupPhaseId : 0}
              url="/schemes?schemeType=round-robin"
              onChange={scheme => this.setState({ groupPhaseId: scheme ? scheme.id : 0 })}>
              <option value={0}>-няма-</option>
            </Select>
            <div className="error">{this.state.errors.groupPhase ? '*Задължително поле' : null}</div>
          </div> : null}

        {this.state.schemeType == 'round-robin' ?
          <div>
            <div className="input-group">
              <div>Брой групи</div>
              <input value={this.state.groupCount} type="number" onChange={(e) => this.setState({ groupCount: e.target.value })} />
              <div className="error">{this.state.errors.gCount ? '*Задължително поле' : null}</div>
            </div>
            <div className="input-group">
              <div>Брой играчи в група</div>
              <input value={this.state.teamsPerGroup} type="number" onChange={(e) => this.setState({ teamsPerGroup: e.target.value })} />
              <div className="error">{this.state.errors.rrTeamCount ? '*Задължително поле' : null}</div>
            </div>
          </div> : null}

        <div className="input-group">
          <div>Възраст от</div>
          <input
            type="number" min="0"
            value={this.state.ageFrom}
            onChange={e => this.setState({ ageFrom: e.target.value })} />
          <div className="error">{this.state.errors.ageFromTo ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.ageFrom ? '*Невалидна стойност' : null}</div>
        </div>

        <div className="input-group">
          <div>Възраст до</div>
          <input
            type="number" min="0"
            value={this.state.ageTo}
            onChange={e => this.setState({ ageTo: e.target.value })} />
          <div className="error">{this.state.errors.ageFromTo ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.ageTo ? '*Невалидна стойност' : null}</div>
        </div>

        <div className="input-group">
          <div>Дата на схемата</div>
          <input type="date"
            value={this.state.date}
            onChange={e => this.setState({ date: e.target.value })} />
          <div className="error">{this.state.errors.tournamentDate ? '*Датата е преди дата за регистрация' : null}</div>
          <div className="error">{this.state.errors.date ? '*Задължително поле' : null}</div>
        </div>

        <div className="input-group">
          <div>Начало на регистрациите</div>
          <input type="datetime-local"
            value={this.state.registrationStart}
            onChange={e => this.setState({ registrationStart: e.target.value })} />
          <div className="error">{this.state.errors.registrationStartEnd ? '*Неправилен интервал' : null}</div>
          <div className="error">{this.state.errors.registrationStart ? '*Задължително поле' : null}</div>
        </div>

        <div className="input-group">
          <div>Последна дата за регистрация</div>
          <input type="datetime-local"
            value={this.state.registrationEnd}
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
          onClick={() => this.update()}>
          Готово
          </ActionButton>

      </form>
    </div >;
  }

  // getDateFormat(date) {
  //   // debugger;
  //   // let str = date.toString();
  //   // str = str.slice(0, str.length - 1);
  //   //return new Date(str).toUTCString();
  //   return new Date(date).toLocaleDateString();
  // }
}