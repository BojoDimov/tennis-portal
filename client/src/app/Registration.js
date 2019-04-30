import React from 'react';
import { post } from '../services/fetch';


export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputType: 'text',
      errors: {},
      showMessage: false
    }
  }

  register() {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errors: {
          confirmPassword: true
        }
      });
      return;
    }
    this.setState({ errors: {} });
    return post('/users', this.state)
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      })
      .then(res => {
        this.setState({ showMessage: true });
        setTimeout(() => this.setState({ showMessage: false }), 5000);
        return res;
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
              <input placeholder="Email" type="text"
                onChange={e => this.setState({ email: e.target.value })} />
              <div className="error">{this.state.errors.email ? '*Невалиден имейл' : null}</div>
              <div className="error">{this.state.errors.email_uq ? '*Потребителското име е заето' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Парола" type="password"
                onChange={e => this.setState({ password: e.target.value })} />
              <div className="error">{this.state.errors.password ? '*Паролата трябва да бъде поне 6 символа и да не съдържа букви на кирилица' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Повтори парола" type="password"
                onChange={e => this.setState({ confirmPassword: e.target.value })} />
              <div className="error">{this.state.errors.confirmPassword ? '*Моля проверете изписването на паролата' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Име" type="text"
                onChange={e => this.setState({ firstName: e.target.value })} />
              <div className="error">{this.state.errors.firstName ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Фамилия" type="text"
                onChange={e => this.setState({ sirName: e.target.value })} />
              <div className="error">{this.state.errors.sirName ? '*Задължително поле' : null}</div>
            </div>
            <div className="col-12">
              {/* onFocus={() => this.setState({ inputType: 'date' })}
                onBlur={() => this.setState({ inputType: 'text' })} */}
              <div style={{ textAlign: 'left' }}>Дата на раждане</div>
              <input type="date"
                onChange={e => this.setState({ birthDate: e.target.value })} />
              <div className="error">{this.state.errors.birthDate ? '*Невалидна дата' : null}</div>
            </div>
            <div className="col-12">
              <input placeholder="Телефонен номер" type="text"
                onChange={e => this.setState({ telephone: e.target.value })} />
              <div className="error">{this.state.errors.telephone ? '*Невалиден телефонен номер' : null}</div>
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
            <div className="login-button" onClick={() => this.register()}>
              Регистрирай ме
            </div>
          </li>
        </ul>
        {this.state.showMessage ?
          <div style={{ color: '#84DC00', fontWeight: '700' }}>
            Регистрацията премина успешно. Моля активирайте своя акаунт чрез линка изпратен на Вашият Email.
        </div> : null}
      </section>
    );
  }
}