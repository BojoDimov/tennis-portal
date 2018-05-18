import React, { Component, Fragment } from 'react';
import { CreateTournament } from './CreateTournament';
import { ViewTournament } from './ViewTournament';
import { get } from '../../services/fetch';
import {
  Route, Switch
} from 'react-router-dom';
import { ItemList } from '../Infrastructure';

export class Tournaments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournaments: []
    };
  }

  getData() {
    return get('/tournaments')
      .then(tournaments => this.setState({ tournaments: tournaments }));
  }

  componentDidUpdate() {
    return this.getData();
  }

  componentDidMount() {
    return this.getData();
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path={`${this.props.match.path}/create`} component={CreateTournament} />
          <Route path={`${this.props.match.path}/view/:id`} component={ViewTournament} />
          <Route exact path={`${this.props.match.path}`} render={() => {
            return (
              <ItemList name="Турнири" items={this.state.tournaments} match={this.props.match} />
            )
          }} />
        </Switch>
      </Fragment >
    );
  }
}
