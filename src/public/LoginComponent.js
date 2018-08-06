import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton } from '../admin/Infrastructure';
import { post } from '../services/fetch';


export class LoginComponent extends Component {
  login() {
    return post('/login', this.state, 'Добре дошли!')
      .then(res => {
        if (res.user.isAdmin) {
          window.localStorage.setItem('token', JSON.stringify(res));
          this.props.onChange();
        }
      });
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box">Вход в системата</h2>
        <form className="form-box">
          <div className="input-group">
            <div>Е-майл</div>
            <input type="text" onChange={e => this.setState({ email: e.target.value })} />
          </div>
          <div className="input-group">
            <div>Парола</div>
            <input type="password" onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <ActionButton onSuccess={`/tournaments`}
            onClick={() => this.login()}
            className="input-group form-box center">
            Вход
          </ActionButton>
          <div className="input-group link-box">
            <Link to="/user/reset">Забравена парола</Link>
            <Link to="/registration">Регистрация</Link>
          </div>
        </form>
      </div>
    )
  }
}