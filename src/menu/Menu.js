import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import logo from './tennis-logo.svg';

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.defaultState
    };
  }

  render() {
    return <div id='menu'>
      <img src={logo} className="logo" alt="logo" />
      <ul>
        <li className={this.GetActiveClass('/tournaments')}>
          <Link to="/tournaments" onClick={() => this.setState({ active: '/tournaments' })}>
            турнири
          </Link>
        </li>
        <li className={this.GetActiveClass('/editions')}>
          <Link to="/editions" onClick={() => this.setState({ active: '/editions' })}>
            издания
          </Link>
        </li>
        <li className={this.GetActiveClass('/schemes')}>
          <Link to="/schemes" onClick={() => this.setState({ active: '/schemes' })}>
            схеми
          </Link>
        </li>
      </ul>
    </div>
  }

  GetActiveClass(path) {
    return this.state.active === path ? 'active' : '';
  }
}