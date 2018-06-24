import React, { Component } from 'react';
import { Admin } from '../admin/Admin';
import { Public } from '../public/Public';
import { Menu } from '../public/Menu';
import { MessagesContainer } from '../public/Messages';
import { Breadcrumb } from '../public/Breadcrumb';
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
      },
      breadcrumb: {
        path: [],
        updatePath: this.updateBreadcrumb.bind(this)
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

  updateBreadcrumb(part) {
    //debugger;
    let path = this.state.breadcrumb.path;
    let newPath = [];
    let end = false;
    for (let i = 0; i < path.length && !end; i++) {
      if (part.category == path[i].category)
        end = true;
      else
        newPath.push(path[i]);
    }
    newPath.push(part)

    this.setState({
      breadcrumb: {
        path: newPath,
        updatePath: this.updateBreadcrumb.bind(this)
      }
    })
  }

  render() {
    return (
      <ProvideAuthenticatedUser value={this.state.authenticatedUser}>
        <Menu />
        <Breadcrumb path={this.state.breadcrumb.path} />
        <LoginGuard isLogged={this.state.authenticatedUser.isLogged} />
        <MessagesContainer />
      </ProvideAuthenticatedUser>
    );
  }
}