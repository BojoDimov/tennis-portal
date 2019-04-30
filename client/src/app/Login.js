import React from 'react';
import { Link } from 'react-router-dom';
import { post } from '../services/fetch';
import * as UserService from '../services/user';
import { RedirectAction } from '../components';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    }
  }

  login(redirect) {
    return post('/login', this.state)
      .catch(err => {
        this.setState({ errors: err })
        throw null;
      })
      .then(token => {
        let user = token.user;
        token.user = undefined;
        UserService.login(token, user);
        if (redirect)
          window.location = '/'
        return Promise.resolve();
      })
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
              <input name="email" placeholder="Email" type="text" onChange={e => this.setState({ email: e.target.value })} />
            </div>
            <div className="col-12">
              <input name="password"
                placeholder="Парола"
                type="password"
                onKeyPress={(e) => e.key == 'Enter' ? this.login(true) : null}
                onChange={e => this.setState({ password: e.target.value })} />
            </div>
            {this.state.errors.login ? <div className="error">
              *Неправилно потребителско име/парола
        </div> : null}
          </div>
        </form>
        <ul className="actions">
          <li><RedirectAction onSuccess="/news" onClick={() => this.login()}>
            <div className="login-button">Вход</div>
          </RedirectAction>
          </li>
          <li><Link to="/recovery">Забравена парола</Link></li>
        </ul>
      </section>
    );
  }
}