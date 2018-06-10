import React, { Component, Fragment } from 'react';
import { get } from '../../services/fetch';
import {
  Route, Switch, Link
} from 'react-router-dom';
import { Status } from '../Infrastructure';
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
        </Switch>
      </Fragment >
    );
  }
}

export class SchemesTable extends React.Component {
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
                <span>Схеми</span>
                <Link to={`/schemes/create`}>
                  <span className="button-group">
                    <span className="button">добавяне</span>
                  </span>
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.schemes.map(t => (
              <tr key={t.id}>
                <td>
                  <Link to={`/schemes/view/${t.id}`} >{t.name}</Link>
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
