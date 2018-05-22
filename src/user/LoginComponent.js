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
      <div className="container">
        <h2 className="headline">Вход на потребител</h2>
        <form>
          <div className="input-group">
            <div>Потребителско име</div>
            <input type="text" value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })} />
          </div>
          <div className="input-group">
            <div>Парола</div>
            <input type="password" value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="input-group">
            <span className="link"><Link to="/registration">Регистрация</Link></span>
            <span className="link"><Link to="/user/reset">Забравена парола</Link></span>
          </div>
          <span className="button">Вход</span>
        </form>
      </div>
    )
  }
}