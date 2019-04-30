import React from 'react';
import Registration from './Registration';
import Login from './Login';
import './login-styles.css';

export default class Auth extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <div className="container">
          <div className="row">
            <Login />
            <Registration />
          </div>
        </div>
      </div>
    );
  }
}