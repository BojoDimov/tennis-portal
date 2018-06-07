import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Tournaments } from './tournaments/Tournaments';
import { Editions } from './editions/Editions';
import { Schemes } from './schemes/Schemes';
import './Admin.css';

export class Admin extends Component {
  defaultRoute = '/tournaments';

  render() {
    return (
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Redirect to="/tournaments" />
          </Route>
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/editions" component={Editions} />
          <Route path="/schemes" component={Schemes} />
          <Route render={() => <h1>404 Not Found.</h1>} />
        </Switch>
      </div>
    );
  }
}