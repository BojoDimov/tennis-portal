import React from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationButton } from '../Infrastructure';
import { post, get } from '../../services/fetch';

export class UserEditComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    get(`/user-edit/${this.props.match.params.id}`)
      .then(e => this.setState(e));
  }

  update() {
    post(`/user-edit/${this.state.id}`, this.state)
      .then(e => {
        this.props.onChange(e);
        this.props.history.push('/users');
      })
      .catch(err => this.setState({ errors: err }));
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box">Промяна на потребител</h2>
        <form className="form-box">
          <div className="input-group">
            <div>Email</div>
            <input
              type="email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })} />
            <div className="error">{this.state.errors.email ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Име</div>
            <input
              type="text"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })} />
            <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Дата на раждане</div>
            <input type="date"
              value={this.state.birthDate}
              onChange={e => this.setState({ birthDate: e.target.value })} />
            <div className="error">{this.state.errors.birthDate ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Телефонен номер</div>
            <input
              value={this.state.telephone}
              type="text"
              onChange={e => this.setState({ telephone: e.target.value })} />
            <div className="error">{this.state.errors.telephone ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Пол</div>
            <select value={this.state.gender} onChange={e => this.setState({ gender: e.target.value })} >
              <option disabled selected >-избери-</option>
              <option value="male">Мъж</option>
              <option value="female">Жена</option>
            </select>
            <div className="error">{this.state.errors.gender ? '*Задължително поле' : null}</div>
          </div>

          <ConfirmationButton className="button-block center"
            onChange={flag => flag ? this.update() : null} >
            Готово
          </ConfirmationButton>
        </form>
      </div>
    );
  }
}