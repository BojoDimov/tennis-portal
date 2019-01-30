import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import SchemesRoot from '../schemes/SchemesRoot';
import EliminationBracket from '../schemes/brackets/EliminationBracket';
import EditionsRoot from '../editions/new/EditionsRoot';
import Schedule from '../schedule/Schedule';
import Courts from '../admin/Courts';
import Seasons from '../admin/Seasons';
import Statistics from '../statistics/Statistics';
import Users from '../admin/Users';
import NavigationModel from '../menu/navigation.model';
import UserService from '../services/user.service';
import UserProfile from '../users/UserProfile';
import AccountActivation from '../login/Activation';
import RecoveryStep1 from '../login/RecoveryStep1';
import RecoveryStep2 from '../login/RecoveryStep2';
import { ApplicationMode } from '../enums';

const routeMapping = {
  '/schedule': Schedule,
  '/players': NotFoundPage,
  '/admin/courts': Courts,
  '/admin/seasons': Seasons,
  '/admin/users': Users,
  '/admin/statistics': Statistics,
  '/account': UserProfile
};

const AppRouting = () => (
  <UserService.WithApplicationMode>
    {mode => <Switch>
      {/* <Route path="/news" component={News} /> */}
      {/* <Route path="/tournaments" component={null} /> */}

      {NavigationModel.routes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} mode={mode} />
        );
      })}

      {mode == ApplicationMode.ADMIN && NavigationModel.adminRoutes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} mode={mode} />
        );
      })}

      {mode == ApplicationMode.USER && NavigationModel.userRoutes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} mode={mode} />
        );
      })}

      {(mode == ApplicationMode.USER || mode == ApplicationMode.ADMIN)
        && <Route path="/users/:id" render={(props) => <UserProfile {...props} mode={mode} />} />}

      <Route path="/oops" component={NotFoundPage} />
      <Route path="/account/activation" render={(props) => <AccountActivation {...props} />} />
      <Route path="/recovery/step1" render={(props) => <RecoveryStep1 {...props} />} />
      <Route path="/recovery/step2" render={(props) => <RecoveryStep2 {...props} />} />
      <Route exact path="/">
        <Redirect to="/schedule" />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
    }
  </UserService.WithApplicationMode>
);

export default AppRouting;

