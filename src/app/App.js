import React, { Component } from 'react';
import { Admin } from '../admin/Admin';
import { Public } from '../public/Public';
import { Menu } from '../public/Menu';
import { ProvideAuthenticatedUser, AuthenticatedUser } from './AuthenticatedUser';

const LoginGuard = ({ isLogged }) => {
  if (isLogged)
    return (<Admin />);
  else
    return (<Public />)
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticatedUser: {
        isLogged: JSON.parse(localStorage.getItem('token')) != null,
        change: this.initAuthenticatedUser.bind(this)
      }
    }
  }

  initAuthenticatedUser() {
    let token = JSON.parse(localStorage.getItem('token'));
    this.setState({
      authenticatedUser: {
        isLogged: token != null,
        change: this.initAuthenticatedUser.bind(this)
      }
    });
  }

  render() {
    return (
      <ProvideAuthenticatedUser value={this.state.authenticatedUser}>
        <Menu />
        <LoginGuard isLogged={this.state.authenticatedUser.isLogged} />
      </ProvideAuthenticatedUser>
    );
  }
}