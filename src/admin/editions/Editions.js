import React, { Component, Fragment } from 'react';
import { get } from '../../services/fetch';
import {
  Route, Switch, Link
} from 'react-router-dom';
import { Status } from '../Infrastructure';
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
        </Switch>
      </Fragment >
    );
  }
}

export class EditionsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Издания</span>
                <Link to={`/editions/create`}>
                  <span className="button">добавяне</span>
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.editions.map(t => (
              <tr>
                <td>
                  <Link to={`/editions/view/${t.id}`} >{t.name}</Link>
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