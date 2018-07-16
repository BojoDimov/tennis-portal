import React from 'react';
import { post } from '../services/fetch';


export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputType: 'text',
      errors: {}
    }
  }

  register() {
    return post('/users', this.state)
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return (
      <section className="col-6 col-12-narrower feature">
        <header>
          <h2>Регистрация</h2>
        </header>
        <form>
          <div className="row gtr-50">
            <div className="col-12">
              <input placeholder="Е-майл" type="text"
                onChange={e => this.setState({ email: e.target.value })} />
              <div className="error">{this.state.errors.email ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Парола" type="password"
                onChange={e => this.setState({ password: e.target.value })} />
              <div className="error">{this.state.errors.password ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Повтори парола" type="password"
                onChange={e => this.setState({ confirmPassword: e.target.value })} />
            </div>
            <div className="col-12">
              <input placeholder="Име" type="text"
                onChange={e => this.setState({ name: e.target.value })} />
              <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Дата на раждане" type={this.state.inputType}
                onFocus={() => this.setState({ inputType: 'date' })}
                onBlur={() => this.setState({ inputType: 'text' })}
                onChange={e => this.setState({ birthDate: e.target.value })} />
              <div className="error">{this.state.errors.birthDate ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Телефонен номер" type="text"
                onChange={e => this.setState({ telephone: e.target.value })} />
              <div className="error">{this.state.errors.telephone ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              <select onChange={e => this.setState({ gender: e.target.value })}>
                <option disabled selected >Пол</option>
                <option value="male">Мъж</option>
                <option value="female">Жена</option>
              </select>
              <div className="error">{this.state.errors.gender ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              Регистрирайки се чрез тази форма, Вие се съгласявате да получавате
              имейли относно състоянието на турнири в които сте записани
            </div>
          </div>
        </form>
        <ul className="actions">
          <li>
            <a className="button" onClick={() => this.register()}>
              Регистрирай ме
            </a>
          </li>
        </ul>
      </section>
    );
  }
}