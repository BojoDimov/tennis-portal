import React from 'react';
import { Link } from 'react-router-dom';
import { get, post } from '../services/fetch';

export default class Recovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
      errors: {}
    }
  }

  parse(query) {
    let token = query.split('token=')[1];
    return token;
  }

  componentDidMount() {
    this.setState({ token: this.parse(this.props.location.search) });
  }

  sendPasswordRecovery() {
    get(`/users/recovery?email=${this.state.email}`)
      .then(() => this.setState({ showMessage: true }));
  }

  acceptPasswordRecovery() {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errors: {
          confirmPassword: true
        }
      });
      return;
    }

    post(`/users/recovery`, this.state)
      .then(() => this.setState({ showMessage: true }))
      .catch(err => this.setState({
        errors: err
      }));
  }

  render() {
    if (this.state.token)
      return (
        <div className="wrapper">
          <div className="content">
            <section className="col-6 col-12-narrower feature">
              <header>
                <h2>Възстановяване на парола</h2>
              </header>
              <form style={{ display: 'flex', justifyContent: 'center' }} onSubmit={(e) => { e.preventDefault(); this.acceptPasswordRecovery() }}>
                <div className="row gtr-50" style={{ maxWidth: '35rem' }}>
                  <div className="col-12">
                    Моля въведете новата си парола. Като допълнителна мярка за защита ви молим да въведете и датата си на раждане.
                  </div>
                  <div className="col-12">
                    <input placeholder="Парола" type="password"
                      onChange={e => this.setState({ password: e.target.value })} />
                    <div className="error">{this.state.errors.password ? '*Паролата трябва да бъде поне 8 символа, да съдържа поне една цифра, една малка буква и една голяма буква' : null}</div>
                  </div>
                  <div className="col-12">
                    <input placeholder="Повтори парола" type="password"
                      onChange={e => this.setState({ confirmPassword: e.target.value })} />
                    <div className="error">{this.state.errors.confirmPassword ? '*Моля проверете изписването на паролата' : null}</div>
                  </div>
                  <div className="col-12">
                    <input placeholder="Дата на раждане" type="date"
                      onChange={e => this.setState({ birthDate: e.target.value })} />
                    <div className="error">{this.state.errors.birthDate ? 'Неправилна дата на раждане' : null}</div>
                    <div className="error" style={{ textAlign: 'center' }}>{this.state.errors.invalidToken ? 'Линкът за възстановяване на парола е невалиден' : null}</div>
                  </div>
                </div>
              </form>
              {this.state.showMessage ?
                <React.Fragment>
                  <ul className="actions">
                    <li><div className="login-button" onClick={() => window.location = '/login'}>Вход</div></li>
                  </ul>
                  <div style={{ color: '#84DC00', fontWeight: '700' }}>
                    Паролата ви е променена успешно
                  </div>
                </React.Fragment> :
                <ul className="actions">
                  <li>
                    <div className="login-button" onClick={() => this.acceptPasswordRecovery()}>
                      Запазване
                  </div>
                  </li>
                </ul>}
            </section>
          </div>
        </div>
      );
    else return (
      <div className="wrapper">
        <div className="content">
          <section className="col-6 col-12-narrower feature">
            <header>
              <h2>Възстановяване на парола</h2>
            </header>
            <form style={{ display: 'flex', justifyContent: 'center' }} onSubmit={(e) => { e.preventDefault(); this.sendPasswordRecovery() }}>
              <div className="row gtr-50" style={{ maxWidth: '35rem' }}>
                <div className="col-12">
                  Моля въведете Вашият имейл. Ще ви бъде изпратено съобщение с инструкции как да възстановите паролата си
                </div>
                <div className="col-12">
                  <input placeholder="Email" type="text"
                    onChange={e => this.setState({ email: e.target.value })} />
                  <div className="error">{this.state.errors.email ? '*Задължително поле' : null}</div>
                </div>
              </div>
            </form>
            <ul className="actions">
              <li>
                <div className="login-button" onClick={() => this.sendPasswordRecovery()}>
                  Изпращане
            </div>
              </li>
            </ul>
            {this.state.showMessage ?
              <div style={{ color: '#84DC00', fontWeight: '700' }}>
                Съобщението е изпратено успешно
        </div> : null}
          </section>
        </div>
      </div>
    );
  }
}