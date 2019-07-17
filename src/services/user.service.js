import React from 'react';
import { dispatchEvent } from './events.service';
import QueryService from './query.service';
import { ApplicationMode } from '../enums';


class UserService {
  constructor() {
    const { Provider, Consumer } = React.createContext(ApplicationMode.GUEST);
    this.SetApplicationMode = Provider;
    this.WithApplicationMode = Consumer;
  }

  async getAuthenticatedUser() {
    return QueryService.get('/login/authData')
      .then(({ data }) => {
        return data;
      });
  }

  login(data) {
    localStorage.setItem('token', data.token);
    dispatchEvent('login');
  }

  logout() {
    localStorage.removeItem('token');
    dispatchEvent('logout');
  }
}

export default new UserService();