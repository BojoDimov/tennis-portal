import React from 'react';
import { Link } from 'react-router-dom';
import { AuthenticatedUser } from '../app/AuthenticatedUser';
export class Menu extends React.Component {
  logout(user) {
    localStorage.setItem('token', null);
    user.change();
  }

  render() {
    return (
      <div id="menu">
        <i className="fas fa-bars"></i>
        <AuthenticatedUser>
          {user => (
            user.isLogged ?
              <span onClick={() => this.logout(user)}><i className="fas fa-power-off" ></i></span> :
              <Link to="/login"><i className="fas fa-sign-in-alt"></i></Link>
          )}
        </AuthenticatedUser>
      </div>
    );
  }
}