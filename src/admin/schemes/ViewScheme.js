import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status, ItemList } from '../Infrastructure';

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
        console.log(res);
        res.loading = false;
        this.setState(res);
      });
  }

  publish() {
    get(`/schemes/${this.state.scheme.id}/publish`)
      .then(() => this.getData());
  }

  draft() {
    get(`/schemes/${this.state.scheme.id}/draft`)
      .then(() => this.getData());
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <Fragment>
          <div className="margin container-fluid">
            <h2 className="section"><span>{this.state.scheme.name}</span> <Status status={this.state.scheme.status} /></h2>
            <div className="margin-left">
              <div className="card">
                <span className="card-heading">Турнир: </span>
                <Link to={`/tournaments/view/${this.state.tournament.id}`}>
                  <span className="card-link">{this.state.tournament.name}</span>
                </Link>
              </div>
              <div className="card">
                <span className="card-heading">Издание: </span>
                <Link to={`/editions/view/${this.state.edition.id}`}>
                  <span className="card-link">{this.state.edition.name}</span>
                </Link>
              </div>
              <div className="card">
                <span className="card-heading">Информация: </span>
                <span>{this.state.scheme.info}</span>
              </div>
              <div className="card">
                <span className="card-heading">Дата: </span>
                <span>{dateString(this.state.scheme.date)}</span>
              </div>
              <div className="card">
                <span className="card-heading">Ограничения: </span>
                <span>{this.getSchemeLimitations()}</span>
              </div>
              <div className="card">
                <span className="card-heading">Брой играчи: </span>
                <span>{this.state.scheme.maxPlayerCount}</span>
              </div>
              <div className="card">
                <span className="card-heading">Записване: </span>
                <span>от {dateString(this.state.scheme.registrationStart)} до {dateString(this.state.scheme.registrationEnd)}</span>
              </div>
              <div className="card">
                <span className="card-heading">Групова фаза: </span>
                {this.state.scheme.hasGroupPhase ? 'има групова фаза' : 'няма групова фаза'}
              </div>
            </div>
            {this.buttons()}
          </div>
          <div className="margin container-fluid">
            <h2 className="section"><span>Ранглиста</span></h2>
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
    if (this.state.scheme.ageFrom & this.state.scheme.ageTo)
      limitations.push('от ' + this.state.scheme.ageFrom + ' до ' + this.state.scheme.ageTo + ' години');
    else if (this.state.scheme.ageFrom)
      limitations.push('от ' + this.state.scheme.ageFrom + ' години');
    else if (this.state.scheme.ageTo)
      limitations.push('до ' + this.state.scheme.ageTo + ' години');

    return limitations.join(', ');
  }

  buttons() {
    return (
      <div className="color margin-top">
        {this.state.scheme.status === 'draft' ? <Link to={`/schemes/edit/${this.state.scheme.id}`}><span className="button">Промяна</span></Link> : null}
        {this.state.scheme.status === 'draft' ? <span className="button spacing" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.scheme.status === 'published' ? <span className="button spacing" onClick={() => this.draft()}>Връщане в чернова</span> : null}
        {this.state.scheme.status === 'published' ? <span className="button spacing">Записване</span> : null}
      </div>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}