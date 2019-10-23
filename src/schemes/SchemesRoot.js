import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SchemeView from '../tournaments/SchemeView';

class SchemesRoot extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          path="/schemes/:id"
          render={(props) => <SchemeView {...props} />}
        />
      </Switch>
    );
  }
}

export default SchemesRoot;