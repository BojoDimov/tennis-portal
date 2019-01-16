import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EditionsList from './EditionsList';
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
          path="/editions"
          render={(props) => <EditionsList {...props} />}
        />
      </Switch>
    );
  }
}

export default EditionsRoot;