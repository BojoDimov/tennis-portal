import React from 'react';
import { post } from '../services/fetch';
import * as UserService from '../services/user';
import { RedirectAction } from '../components';

export default class Login extends React.Component {
  login() {
    return post('/login', this.state)
      .then(token => {
        let user = token.user;
        token.user = undefined;
        UserService.login(token, user);
        return Promise.resolve();
      });
  }

  render() {
    return (
      <section className="col-6 col-12-narrower feature">
        <header>
          <h2>Вход</h2>
        </header>
        <form>
          <div className="row gtr-50">
            <div className="col-12">
              <input name="email" placeholder="Е-майл" type="text" onChange={e => this.setState({ email: e.target.value })} />
            </div>
            <div className="col-12">
              <input name="password" placeholder="Парола" type="password" onChange={e => this.setState({ password: e.target.value })} />
            </div>
          </div>
        </form>
        <ul className="actions">
          <RedirectAction onSuccess="/news" onClick={() => this.login()}>
            <a className="button">Вход</a>
          </RedirectAction>
        </ul>
      </section>
    );
  }
}