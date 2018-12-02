import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EditionsList from './EditionsList';

class EditionsRoot extends React.Component {
  render() {
    return (
      <Switch>
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