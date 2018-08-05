import React from 'react';
import { Link } from 'react-router-dom';
import { AuthenticatedUser } from '../app/AuthenticatedUser';

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenuDrop: false
    }
  }
  logout() {
    localStorage.setItem('token', null);
    window.location.replace('/');
  }

  render() {
    return (
      <div id="menu">


        <div className="dropdown" onClick={() => this.setState({ showMenuDrop: !this.state.showMenuDrop })}>
          <i className="fas fa-bars" ></i>
          {this.state.showMenuDrop ?
            <div style={{ width: '10rem' }} className="dropdown-content" onClick={() => this.setState({ showMenuDrop: !this.state.showMenuDrop })}>
              <Link style={{ display: 'block' }} to="/news">Преглед на новни</Link>
              <Link to="/news/create">Нова новина</Link>
            </div> : null}
        </div>

        <AuthenticatedUser>
          {user => (
            user.isLogged ?
              <span onClick={() => this.logout()}><i className="fas fa-power-off" ></i></span> :
              <Link to="/login"><i className="fas fa-sign-in-alt"></i></Link>
          )}
        </AuthenticatedUser>
      </div>
    );
  }
}