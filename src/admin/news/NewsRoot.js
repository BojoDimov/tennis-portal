import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Create } from './Create';

export class NewsRoot extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/news/create" component={Create} />
        <Route render={() => <h1 style={{ textAlign: "center" }}>404 Not Found</h1>} />
      </Switch>
    )
  }
}
