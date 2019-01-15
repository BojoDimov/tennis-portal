import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Editions from './Editions';
import EditionView from './EditionView';

class EditionsRoot extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          path="/editions/:id"
          render={(props) => <EditionView {...props} />}
        />
        <Route
          exact
          path="/editions/"
          render={(props) => <Editions {...props} />}
        />
      </Switch>
    );
  }
}

export default EditionsRoot;