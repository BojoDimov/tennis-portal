import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';

export default class Header extends React.Component {
  componentDidMount() {
    const e = new CustomEvent('react-load', null);
    document.dispatchEvent(e);
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
              <li className="break"><Link to="/ranking">Статистика</Link></li>
              <li><Link to="/partners">Партньори</Link></li>
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