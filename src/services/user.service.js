import React from 'react';
import { dispatchEvent } from './events.service';
import QueryService from './query.service';
import { ApplicationMode } from '../enums';


class UserService {
  constructor() {
    const { Provider, Consumer } = React.createContext(ApplicationMode.GUEST);
    this.SetApplicationMode = Provider;
    this.WithApplicationMode = Consumer;
    this.cached = false;
    this.user = null;
  }

  async getAuthenticatedUser() {
    if (!this.cached)

      this.user = QueryService.get('/login/authData')
        .then(({ data }) => {
          this.cached = true;
          return data;
        });

    return this.user;
  }

  login(data) {
    localStorage.setItem('token', data.token);
    this.cached = false;
    dispatchEvent('login');
  }

  logout() {
    localStorage.removeItem('token');
    this.cached = false;
    dispatchEvent('logout');
  }
}

export default new UserService();