import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status } from '../Infrastructure';

export class ViewScheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TournamentEdition: {
        Tournament: {}
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    get(`/schemes/${this.props.match.params.id}`)
      .then(res => this.setState(res));
  }

  publish() {
    get(`/schemes/${this.state.id}/publish`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/schemes/${this.state.id}/draft`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  render() {
    return (
      <div className="container test">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>{this.state.name}</span>
                <Status status={this.state.status} />
                {this.buttons()}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="labels"><b>Турнир</b></td>
                      <td>
                        <Link to={`/tournaments/view/${this.state.TournamentEdition.Tournament.id}`}>
                          {this.state.TournamentEdition.Tournament.name}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td><b>Издание</b></td>
                      <td>
                        <Link to={`/editions/view/${this.state.TournamentEdition.id}`}>
                          {this.state.TournamentEdition.name}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td><b>Информация</b></td><td>{this.state.info}</td>
                    </tr>
                    <tr>
                      <td><b>Дата</b></td><td>{dateString(this.state.date)}</td>
                    </tr>
                    <tr>
                      <td><b>Ограничения</b></td><td>{this.getSchemeLimitations()}</td>
                    </tr>
                    <tr>
                      <td><b>Брой играчи</b></td><td>{this.state.maxPlayerCount}</td>
                    </tr>
                    <tr>
                      <td><b>Записване</b></td>
                      <td>
                        от {dateString(this.state.registrationStart)} до {dateString(this.state.registrationEnd)}
                      </td>
                    </tr>
                    <tr>
                      <td><b>Групова фаза</b></td>
                      <td>
                        {this.state.hasGroupPhase ? 'има групова фаза' : 'няма групова фаза'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  getSchemeLimitations() {
    const limitations = [];
    if (this.state.singleTeams)
      limitations.push('единични отбори');
    else
      limitations.push('двойки');
    if (this.state.maleTeams)
      limitations.push('мъжки отбори');
    if (this.state.femaleTeams)
      limitations.push('женски отбори');
    if (this.state.mixedTeams)
      limitations.push('смесени двойки');
    if (this.state.ageFrom && this.state.ageTo)
      limitations.push('от ' + this.state.ageFrom + ' до ' + this.state.ageTo + ' години');
    else if (this.state.ageFrom)
      limitations.push('от ' + this.state.ageFrom + ' години');
    else if (this.state.ageTo)
      limitations.push('до ' + this.state.ageTo + ' години');

    return limitations.join(', ');
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.status === 'draft' ? <span className="button"><Link to={`/schemes/edit/${this.state.id}`}>Промяна</Link></span> : null}
        {this.state.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </span>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}