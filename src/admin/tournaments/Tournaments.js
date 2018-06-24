import React, { Component, Fragment } from 'react';
import { CreateTournament } from './CreateTournament';
import { ViewTournament } from './ViewTournament';
import { EditTournament } from './EditTournament';
import { get } from '../../services/fetch';
import {
  Route, Switch, Link
} from 'react-router-dom';
import { Status } from '../Infrastructure';

export class Tournaments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournaments: []
    };

    this.updateTournamentsHandle = this.getData.bind(this);
  }

  getData() {
    return get('/tournaments')
      .then(tournaments => this.setState({ tournaments: tournaments }));
  }

  componentDidMount() {
    return this.getData();
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path={`${this.props.match.path}/create`} render={(props) => {
            return (
              <CreateTournament {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route path={`${this.props.match.path}/view/:id`} render={(props) => {
            return (
              <ViewTournament {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route path='/tournaments/edit/:id' render={(props) => <EditTournament {...props} />} />
          <Route exact path={`${this.props.match.path}`} render={() => <TournamentsTable tournaments={this.state.tournaments} />} />
        </Switch>
      </Fragment>
    );
  }
}

export class TournamentsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Турнири</span>
                <Link to={`/tournaments/create`}>

                  <span className="button-group">
                    <span className="button">добавяне</span>
                  </span>
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.tournaments.map(t => (
              <tr key={t.id}>
                <td>
                  <Link to={`/tournaments/view/${t.id}`} >{t.name}</Link>
                  <Status status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
