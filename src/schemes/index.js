import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Schemes from './Schemes';
import SchemeView from './SchemeView';

class SchemesRoot extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          path="/schemes/:id"
          render={(props) => <SchemeView {...props} />}
        />
        {/* <Route
          exact
          path="/editions/"
          render={(props) => <Editions {...props} />}
        /> */}
      </Switch>
    );
  }
}

export default SchemesRoot;