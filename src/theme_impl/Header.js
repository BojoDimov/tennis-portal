import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import { RedirectAction } from '../components';
import * as UserService from '../services/user';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserService.getUser()
    }
  }
  componentDidMount() {
    const e = new CustomEvent('react-load', null);
    document.dispatchEvent(e);
    document.addEventListener('login', ({ detail }) => {
      this.setState({ user: detail.user });
    });
    document.addEventListener('logout', () => this.setState({ user: null }));
  }

  render() {
    return (
      <div id="header-wrapper">
        <div id="header" className="container">
          <h1 id="logo"><Link to="/home">Smile Cup</Link></h1>
          <nav id="nav">
            <ul>
              <li><Link to="/news">Новини</Link></li>
              <li>
                <a href="#">Турнири</a>
                <ul>
                  <li><a href="#">Лято 2018</a></li>
                  <li><a href="#">Лято 2019</a></li>
                  <li><a href="#">Лято 2020</a></li>
                  <li>
                    <a href="#">Лято 2021</a>
                    <ul>
                      <li><a href="#">мъже-групи</a></li>
                      <li><a href="#">мъже-елиминации</a></li>
                      <li><a href="#">жени-групи</a></li>
                      <li><a href="#">жени-елиминации</a></li>
                    </ul>
                  </li>
                  <li><a href="#">Лято 2022</a></li>
                </ul>
              </li>
              <li className={this.state.user ? "" : "break"}><Link to="/ranking">Статистика</Link></li>
              <li className={this.state.user ? "break" : ""}><Link to="/partners">Партньори</Link></li>
              <li></li>
              {this.state.user ? <li>
                <a><i class="fas fa-user"></i> <span>{this.state.user.name}</span></a>
                <ul>
                  <li><a href="#">Профил</a></li>
                  <li><Link to="/logout">Изход</Link></li>
                </ul>
              </li> : null}
            </ul>
          </nav>
        </div>

        <Switch>
          <Route path="/home" component={HeroComponent} />
        </Switch>
      </div>
    );
  }
}

export class HeroComponent extends React.Component {
  render() {
    return (
      <section id="hero" className="container">
        <header>
          <h2>Албена 2018</h2>
        </header>
        <p>Плажът няма да е единственото горещо място</p>
        <ul className="actions">
          <li><Link to="/login" className="button">Включи се!</Link></li>
        </ul>
      </section>
    );
  }
}