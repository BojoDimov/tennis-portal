import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton } from '../admin/Infrastructure';
import { post } from '../services/fetch';

export class LoginComponent extends Component {
  login() {
    return post('/login', this.state)
      .then(res => {
        window.localStorage.setItem('token', JSON.stringify(res));
        return this.props.onChange();
      });
  }

  render() {
    return (
      <div className="container">
        <h2 className="headline">Вход в системата</h2>
        <form>
          <div className="input-group">
            <div>Потребителско име</div>
            <input type="text" onChange={e => this.setState({ username: e.target.value })} />
          </div>
          <div className="input-group">
            <div>Парола</div>
            <input type="password" onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="input-group">
            <span className="link"><Link to="/registration">Регистрация</Link></span>
            <span className="link"><Link to="/user/reset">Забравена парола</Link></span>
          </div>
          <ActionButton onSuccess={`/tournaments`} onClick={() => this.login()}>
            Вход
          </ActionButton>
        </form>
      </div>
    )
  }
}