import React, { Component } from 'react';

export class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      age: undefined,
      gender: undefined,
      telephone: undefined,
      errors: []
    };
  }

  create() {
    console.log(this.state);
  }

  render() {
    return (
      <div className="margin container">
        <h2 className="section">Създаване на акаунт</h2>
        <form>
          <div>
            <div className="margin input">
              <div>Потребителско име</div>
              <input
                type="text"
                value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })} />
            </div>
            <div className="margin input">
              <div>E-майл</div>
              <input
                type="email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Парола</div>
              <input
                type="password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Повтори парола</div>
              <input
                type="password"
                value={this.state.confirmPassword}
                onChange={e => this.setState({ confirmPassword: e.target.value })} />
            </div>
          </div>
          <div>
            <div className="margin input">
              <div>Име</div>
              <input
                type="text"
                value={this.state.fullname}
                onChange={e => this.setState({ fullname: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Възраст</div>
              <input
                type="number"
                min="0"
                max="200"
                value={this.state.age}
                onChange={e => this.setState({ age: e.target.value })} />
            </div>
            <div className="margin input">
              <div>Телефонен номер</div>
              <input
                type="text"
                value={this.state.telephone}
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
            <div className="margin input">
              <span className="button" onClick={() => this.create()}>Регистрирай ме</span>
            </div>
          </div>
        </form>
      </div>
    )
  }
}