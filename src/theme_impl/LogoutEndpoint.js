import React from 'react';
import * as UserService from '../services/user';

export default class LogoutEndpoint extends React.Component {
  componentDidMount() {
    UserService.logout();
    window.location = '/';
  }

  render() {
    return null;
  }
}