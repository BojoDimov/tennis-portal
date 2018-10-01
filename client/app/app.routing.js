import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import Home from './Home';
import News from '../news';
import Users from '../users';
import Schemes from '../schemes';
import Editions from '../editions';

const AppRouting = () => (
  <Switch>
    <Route path="/users" component={Users} />
    <Route path="/news" component={News} />
    <Route path="/tournaments" component={null} />
    <Route path="/editions" component={Editions} />
    <Route path="/schemes" component={Schemes} />
    <Route path="/oops" component={NotFoundPage} />
    <Route exact path="/" component={Home} />
  </Switch>
);

export default AppRouting;

