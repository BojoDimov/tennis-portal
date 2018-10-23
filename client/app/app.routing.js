import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import Users from '../users';
import Schemes from '../schemes';
import Editions from '../editions';
import Schedule from '../schedule/Schedule';
import Courts from '../admin/Courts';
import NavigationModel from '../menu/navigation.model';
import UserService from '../services/user.service';
import { ApplicationMode } from '../enums';

const routeMapping = {
  '/schedule': Schedule,
  '/players': NotFoundPage,
  '/admin/courts': Courts,
  '/admin/seasons': NotFoundPage,
  '/admin/config': NotFoundPage,
  '/admin/users': NotFoundPage
};

const AppRouting = () => (
  <UserService.WithApplicationMode>
    {mode => <Switch>
      {/* <Route path="/users" component={Users} /> */}
      {/* <Route path="/news" component={News} /> */}
      {/* <Route path="/tournaments" component={null} /> */}
      {/* <Route path="/editions" component={Editions} /> */}
      {/* <Route path="/schemes" component={Schemes} /> */}
      {/* <Route path="/schedule/admin" component={ScheduleAdmin} /> */}
      {/* <Route path="/schedule" component={Schedule} />
      <Route path="/admin" component={ScheduleAdmin} /> */}
      {NavigationModel.routes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} />
        );
      })}
      {mode == ApplicationMode.ADMIN && NavigationModel.adminRoutes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} />
        );
      })}
      <Route path="/oops" component={NotFoundPage} />
      <Route exact path="/">
        <Redirect to="/schedule" />
      </Route>
    </Switch>
    }
  </UserService.WithApplicationMode>
);

export default AppRouting;

