import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import Schemes from '../schemes';
import Editions from '../editions';
import Schedule from '../schedule/Schedule';
import Courts from '../admin/Courts';
import Seasons from '../admin/Seasons';
import Users from '../admin/Users';
import Subscriptions from '../admin/Subscriptions';
import NavigationModel from '../menu/navigation.model';
import UserService from '../services/user.service';
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
  '/admin/subscriptions': Subscriptions,
  '/admin/config': NotFoundPage
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
      <Route path="/account/activation" render={(props) => <AccountActivation {...props} />} />
      <Route path="/recovery/step1" render={(props) => <RecoveryStep1 {...props} />} />
      <Route path="/recovery/step2" render={(props) => <RecoveryStep2 {...props} />} />
      <Route exact path="/">
        <Redirect to="/schedule" />
      </Route>
    </Switch>
    }
  </UserService.WithApplicationMode>
);

export default AppRouting;

