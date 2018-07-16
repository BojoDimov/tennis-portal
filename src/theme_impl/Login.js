import React from 'react';
import { post } from '../services/fetch';

export default class Login extends React.Component {
  login() {
    console.log('calling login');
    return post('/login', this.state)
      .then(res => {
        //window.localStorage.setItem('token', JSON.stringify(res));
        //this.props.onChange();
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
          <li><a onClick={() => this.login()} className="button">Вход</a></li>
        </ul>
      </section>
    );
  }
}