import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  render() {
    return (
      <div className="margin container-fluid">
        <h2 className="headline">Вход на потребител</h2>
        <form>
          <div className="margin input">
            <div>Потребителско име</div>
            <input type="text" value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })} />
          </div>
          <div className="margin input">
            <div>Парола</div>
            <input type="password" value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="input">
            <Link to="/registration">Регистрация</Link>
            <Link to="/user/reset">Забравена парола</Link>
          </div>
          <div className="margin input">
            <span className="button" >Вход</span>
          </div>
        </form>
      </div>
    )
  }
}