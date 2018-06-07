import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status } from '../Infrastructure';

export class ViewScheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      edition: {},
      scheme: {},
      loading: true
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    get(`/schemes/${this.props.match.params.id}`)
      .then(res => {
        res.loading = false;
        this.setState(res);
      });
  }

  publish() {
    get(`/schemes/${this.state.scheme.id}/publish`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/schemes/${this.state.scheme.id}/draft`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <div className="container-fluid">
          <table className="list-table">
            <thead>
              <tr>
                <th>
                  <span>{this.state.scheme.name}</span>
                  <Status status={this.state.scheme.status} />
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
                          <Link to={`/tournaments/view/${this.state.tournament.id}`}>
                            {this.state.tournament.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Издание</b></td>
                        <td>
                          <Link to={`/editions/view/${this.state.edition.id}`}>
                            {this.state.edition.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Информация</b></td><td>{this.state.scheme.info}</td>
                      </tr>
                      <tr>
                        <td><b>Дата</b></td><td>{dateString(this.state.scheme.date)}</td>
                      </tr>
                      <tr>
                        <td><b>Ограничения</b></td><td>{this.getSchemeLimitations()}</td>
                      </tr>
                      <tr>
                        <td><b>Брой играчи</b></td><td>{this.state.scheme.maxPlayerCount}</td>
                      </tr>
                      <tr>
                        <td><b>Записване</b></td>
                        <td>
                          от {dateString(this.state.scheme.registrationStart)} до {dateString(this.state.scheme.registrationEnd)}
                        </td>
                      </tr>
                      <tr>
                        <td><b>Групова фаза</b></td>
                        <td>
                          {this.state.scheme.hasGroupPhase ? 'има групова фаза' : 'няма групова фаза'}
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
    if (this.state.scheme.singleTeams)
      limitations.push('единични отбори');
    else
      limitations.push('двойки');
    if (this.state.scheme.maleTeams)
      limitations.push('мъжки отбори');
    if (this.state.scheme.femaleTeams)
      limitations.push('женски отбори');
    if (this.state.scheme.mixedTeams)
      limitations.push('смесени двойки');
    if (this.state.scheme.ageFrom && this.state.scheme.ageTo)
      limitations.push('от ' + this.state.scheme.ageFrom + ' до ' + this.state.scheme.ageTo + ' години');
    else if (this.state.scheme.ageFrom)
      limitations.push('от ' + this.state.scheme.ageFrom + ' години');
    else if (this.state.scheme.ageTo)
      limitations.push('до ' + this.state.scheme.ageTo + ' години');

    return limitations.join(', ');
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.scheme.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.scheme.status === 'draft' ? <span className="button"><Link to={`/schemes/edit/${this.state.scheme.id}`}>Промяна</Link></span> : null}
        {this.state.scheme.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </span>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}