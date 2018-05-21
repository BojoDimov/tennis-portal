import React, { Component, Fragment } from 'react';
import { get } from '../../services/fetch';
import {
  Route, Switch
} from 'react-router-dom';
import { ItemList } from '../Infrastructure';
import { CreateScheme } from './CreateScheme';
import { ViewScheme } from './ViewScheme';
import { EditScheme } from './EditScheme';

export class Schemes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schemes: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return get('/schemes')
      .then(schemes => this.setState({ schemes: schemes }));
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path={`${this.props.match.path}/create`} render={(props) => {
            return (
              <CreateScheme {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route path={`${this.props.match.path}/view/:id`} render={(props) => {
            return (
              <ViewScheme {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route path={`${this.props.match.path}/edit/:id`} render={(props) => {
            return (
              <EditScheme {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route exact path={`${this.props.match.path}`} render={() => {
            return (
              <ItemList name="Схеми" items={this.state.schemes} match={this.props.match} />
            )
          }} />
        </Switch>
      </Fragment >
    );
  }
}
