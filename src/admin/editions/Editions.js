import React, { Component, Fragment } from 'react';
import { get } from '../../services/fetch';
import {
  Route, Switch
} from 'react-router-dom';
import { ItemList } from '../Infrastructure';
import { CreateEdition } from './CreateEdition';
import { ViewEdition } from './ViewEdition';
import { EditEdition } from './EditEdition';

export class Editions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: []
    };
  }

  componentDidMount() {
    return this.getData();
  }

  getData() {
    return get('/editions')
      .then(editions => this.setState({ editions: editions }));
  }

  render() {
    return (
      <Fragment>
        <Switch>
          <Route path={`${this.props.match.path}/create`} render={(props) => {
            return (
              <CreateEdition {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route path={`${this.props.match.path}/view/:id`} render={(props) => {
            return (
              <ViewEdition {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route path={`${this.props.match.path}/edit/:id`} render={(props) => {
            return (
              <EditEdition {...props} onChange={() => this.getData()} />
            );
          }} />
          <Route exact path={`${this.props.match.path}`} render={() => {
            return (
              <ItemList name="Издания" items={this.state.editions} match={this.props.match} />
            )
          }} />
        </Switch>
      </Fragment >
    );
  }
}