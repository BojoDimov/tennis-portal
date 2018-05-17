import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Menu } from './menu/Menu'
import { Tournaments } from './tournaments/Tournaments';
import { Schemes } from './schemes/Schemes';
import { Editions } from './editions/Editions';

export class Admin extends Component {
  defaultRoute = '/tournaments';

  render() {
    return <div>
      <Menu defaultRoute={this.defaultRoute} />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Redirect to={this.defaultRoute} />
          </Route>
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/schemes" component={Schemes} />
          <Route path="/editions" component={Editions} />
        </Switch>
      </div>
    </div >;
  }
}