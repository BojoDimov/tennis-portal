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
    if (this.state.emailAgreement)
      return post('/users', this.state)
        .catch(err => {
          this.setState({ errors: err });
          throw err;
        });
    else return Promise.reject();
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box">Регистрация</h2>
        <form className="form-box">
          <div className="input-group">
            <div>E-майл</div>
            <input
              type="email"
              onChange={e => this.setState({ email: e.target.value })} />
            <div className="error">{this.state.errors.email ? '*Задължително поле' : null}</div>
          </div>
          <div className="input-group">
            <div>Парола</div>
            <input
              type="password"
              onChange={e => this.setState({ password: e.target.value })} />
            <div className="error">{this.state.errors.password ? '*Задължително поле' : null}</div>
          </div>
          <div className="input-group">
            <div>Повтори парола</div>
            <input
              type="password"
              onChange={e => this.setState({ confirmPassword: e.target.value })} />
          </div>

          <div className="input-group">
            <div>Име</div>
            <input
              type="text"
              onChange={e => this.setState({ fullname: e.target.value })} />
            <div className="error">{this.state.errors.fullname ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Дата на раждане</div>
            <input type="date"
              onChange={e => this.setState({ birthDate: e.target.value })} />
            <div className="error">{this.state.errors.birthDate ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Телефонен номер</div>
            <input
              type="text"
              onChange={e => this.setState({ telephone: e.target.value })} />
            <div className="error">{this.state.errors.telephone ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>Пол</div>
            <select onChange={e => this.setState({ gender: e.target.value })} >
              <option disabled selected >-избери-</option>
              <option value="male">Мъж</option>
              <option value="female">Жена</option>
            </select>
            <div className="error">{this.state.errors.gender ? '*Задължително поле' : null}</div>
          </div>

          <div className="input-group">
            <div>
              <label className="cursor">
                <input type="checkbox"
                  onChange={e => this.setState({ emailAgreement: !this.state.emailAgreement })} />
                Съгласен съм да получавам имейли относно състоянието на турнири в които съм записан</label>
            </div>
          </div>

          <ActionButton className="center"
            onSuccess="/login"
            disabled={!this.state.emailAgreement}
            onClick={() => this.create()}>Регистрирай ме</ActionButton>
        </form>
      </div>
    )
  }
}