import React from 'react';
import { Switch, Route } from 'react-router-dom';

import UsersView from './UsersView';
import Users from './Users';

class UsersRoot extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          path="/users/:id"
          render={(props) => <UsersView {...props} />}
        />
        <Route
          exact
          path="/users"
          render={(props) => <Users {...props} />}
        />
      </Switch>
    )
  }
}

export default UsersRoot;