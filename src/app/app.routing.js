import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import TournamentView from '../tournaments/TournamentView';
import SchemesRoot from '../schemes/SchemesRoot';
import GroupsBracket from '../schemes/brackets/GroupsBracket';
import EliminationBracket from '../schemes/brackets/EliminationBracket';
import EditionsRoot from '../editions/EditionsRoot';
import TournamentsRoot from '../tournaments/TournamentsRoot';
import ChampionsRoot from '../tournaments/ChampionsRoot';
import PlayersRoot from '../tournaments/PlayersRoot';

import Schedule from '../schedule/Schedule';
import Courts from '../admin/courts/Courts';
import Seasons from '../admin/seasons/Seasons';
import Statistics from '../admin/statistics/Statistics';
import Users from '../admin/users/Users';
import TeamView from '../users/TeamView';
import UserService from '../services/user.service';
import UserProfile from '../users/UserProfile';
import AccountView from '../users/AccountView';
import AccountActivation from '../login/Activation';
import RecoveryStep1 from '../login/RecoveryStep1';
import RecoveryStep2 from '../login/RecoveryStep2';
import { ApplicationMode } from '../enums';

import {
  adminRoutes,
  tournamentAdditional,
  desktopRoutes,
  userRoutes
} from '../menu/menu.configuration';

const routeMapping = {
  '/schedule': Schedule,
  '/editions': EditionsRoot,

  //tournament routes
  '/players': PlayersRoot,
  '/leagues': TournamentsRoot,
  '/champions': ChampionsRoot,

  //admin routes
  '/admin/courts': Courts,
  '/admin/seasons': Seasons,
  '/admin/users': Users,
  '/admin/statistics': Statistics,

  //user routes
  '/account': AccountView
};

const AppRouting = () => (
  <UserService.WithApplicationMode>
    {mode => <Switch>
      <Route path="/tournaments/:id" component={TournamentView} />
      <Route path="/schemes/:id/groups" component={GroupsBracket} />
      <Route path="/schemes/:id/elimination" component={EliminationBracket} />
      <Route path="/schemes" component={SchemesRoot} />
      <Route path="/teams/:id" component={TeamView} />

      {desktopRoutes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} mode={mode} />
        );
      })}

      {tournamentAdditional.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} mode={mode} />
        );
      })}

      {mode == ApplicationMode.ADMIN && adminRoutes.map(route => {
        return (
          <Route key={route.id} path={route.to} component={routeMapping[route.to]} mode={mode} />
        );
      })}

      {mode != ApplicationMode.GUEST && userRoutes.map(route => {
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

