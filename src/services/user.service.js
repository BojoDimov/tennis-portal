import React from 'react';
import { dispatchEvent } from './events.service';
import { ApplicationMode } from '../enums';

class UserService {
  constructor() {
    const { Provider, Consumer } = React.createContext(ApplicationMode.GUEST);
    this.SetApplicationMode = Provider;
    this.WithApplicationMode = Consumer;
  }

  isLogged() {
    return localStorage.getItem('token') != null;
  }

  isAdmin() {
    const user = this.getUser();
    if (user && user.isAdmin)
      return true;
    else return false;
  }

  getUser() {
    let token = JSON.parse(localStorage.getItem('token'))
    let user = (token || { user: null }).user;
    if (user && new Date(token.expires) > new Date())
      return user;
    else return null;
  }

  login(token) {
    localStorage.setItem('token', JSON.stringify(token));
    dispatchEvent('login');
  }

  logout() {
    localStorage.removeItem('token');
    dispatchEvent('logout');
  }
}

export default new UserService();