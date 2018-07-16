import React from 'react';
import { Route } from 'react-router-dom';

export class RedirectAction extends React.Component {
  render() {
    return (
      <Route render={({ history }) => {
        return (
          <li onClick={() => this.click()}>
            {this.props.children}
          </li>
        );
      }} />
    );
  }

  click(history) {
    console.log('clicked on redirect action', history)
    this.props.onClick()
      .then(() => window.location = this.props.onSuccess)
      .catch(() => { });
  }
}