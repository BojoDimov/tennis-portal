import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import logo from './tennis-logo.svg';

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null
    };
  }

  render() {
    return <div id='menu'>
      <img src={logo} className="logo" alt="logo" />
      <ul>
        <li onClick={() => this.setState({ active: '/tournaments' })}
          className={this.GetActiveClass('/tournaments')}>
          <Link to="/tournaments">турнири</Link>
        </li>
        <li onClick={() => this.setState({ active: '/editions' })}
          className={this.GetActiveClass('/editions')}>
          <Link to="/editions">издания</Link>
        </li>
        <li onClick={() => this.setState({ active: '/schemes' })}
          className={this.GetActiveClass('/schemes')}>
          <Link to="/schemes">схеми</Link>
        </li>
      </ul>
    </div>
  }

  GetActiveClass(path) {
    return this.state.active === path ? 'active' : '';
  }
}