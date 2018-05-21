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
        <Fragment>
          <div className="container-fluid">
            <h2 className="headline"><span>{this.state.scheme.name}</span> <Status status={this.state.scheme.status} /></h2>
            <div className="card">
              <div>
                <span className="label">Турнир: </span>
                <span className="value link">
                  <Link to={`/tournaments/view/${this.state.tournament.id}`}>
                    {this.state.tournament.name}
                  </Link>
                </span>
              </div>
              <div>
                <span className="label">Издание: </span>
                <span className="value link">
                  <Link to={`/editions/view/${this.state.edition.id}`}>
                    {this.state.edition.name}
                  </Link>
                </span>
              </div>
              <div>
                <span className="label">Информация: </span>
                <span className="value">{this.state.scheme.info}</span>
              </div>
              <div >
                <span className="label">Дата: </span>
                <span className="value">{dateString(this.state.scheme.date)}</span>
              </div>
              <div >
                <span className="label">Ограничения: </span>
                <span className="value">{this.getSchemeLimitations()}</span>
              </div>
              <div >
                <span className="label">Брой играчи: </span>
                <span className="value">{this.state.scheme.maxPlayerCount}</span>
              </div>
              <div >
                <span className="label">Записване: </span>
                <span className="value">от {dateString(this.state.scheme.registrationStart)} до {dateString(this.state.scheme.registrationEnd)}</span>
              </div>
              <div >
                <span className="label">Групова фаза: </span>
                <span className="value">
                  {this.state.scheme.hasGroupPhase ? 'има групова фаза' : 'няма групова фаза'}
                </span>
              </div>
            </div>
            {this.buttons()}
          </div>
        </Fragment>
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
      <div className="button-group">
        {this.state.scheme.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.scheme.status === 'draft' ? <span className="button"><Link to={`/schemes/edit/${this.state.scheme.id}`}>Промяна</Link></span> : null}
        {this.state.scheme.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </div>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}