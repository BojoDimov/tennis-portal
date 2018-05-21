import React, { Component } from 'react';
import { post } from '../services/fetch';
import { ActionButton } from '../admin/Infrastructure';

export class RegistrationComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {}
    };
  }

  create() {
    return post('/users', this.state)
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return (
      <div className="margin container-fluid">
        <h2 className="headline">Създаване на акаунт</h2>
        <form>
          <div>
            <div className="margin input">
              <div>Потребителско име</div>
              <input
                type="text"
                onChange={e => this.setState({ username: e.target.value })} />
            </div>
            <div className="margin input">
              <div>E-майл</div>
              <input
                type="email"
                onChange={e => this.setState({ email: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Парола</div>
              <input
                type="password"
                onChange={e => this.setState({ password: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Повтори парола</div>
              <input
                type="password"
                onChange={e => this.setState({ confirmPassword: e.target.value })} />
            </div>
          </div>
          <div>
            <div className="margin input">
              <div>Име</div>
              <input
                type="text"
                onChange={e => this.setState({ fullname: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Възраст</div>
              <input
                type="number"
                min="0"
                max="200"
                onChange={e => this.setState({ age: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Телефонен номер</div>
              <input
                type="text"
                onChange={e => this.setState({ telephone: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Пол</div>
              <select onChange={e => this.setState({ gender: e.target.value })} >
                <option disabled selected >-избери-</option>
                <option value="male">Мъж</option>
                <option value="female">Жена</option>
              </select>
            </div>
            <ActionButton className="margin input"
              onSuccess="/login"
              onClick={() => this.create()}>Регистрирай ме</ActionButton>
          </div>
        </form>
      </div>
    )
  }
}