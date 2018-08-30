import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Tournaments } from './tournaments/Tournaments';
import { Editions } from './editions/Editions';
import { Schemes } from './schemes/Schemes';
import { NewsRoot } from './news/NewsRoot';
import Users from './users';

export class Admin extends React.Component {
  render() {
    return (
      <div className="public">
        <Switch>
          <Route exact path="/">
            <Redirect to="/tournaments" />
          </Route>
          <Route path="/news" component={NewsRoot} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/editions" component={Editions} />
          <Route path="/schemes" component={Schemes} />
          <Route path="/users" component={Users} />
          <Route render={() => <h1 style={{ textAlign: "center" }}>404 Not Found</h1>} />
        </Switch>
      </div>
    );
  }
}