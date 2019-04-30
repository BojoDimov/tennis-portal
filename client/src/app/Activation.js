import React from 'react';
import { Link } from 'react-router-dom';
import { get, post } from '../services/fetch';
import { ModalMessage, createOpenModalEvent } from './Infrastructure';

export default class Activation extends React.Component {
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
    this.activate();
  }

  activate() {
    post(`/users/activation`, { token: this.parse(this.props.location.search) })
      .then(() => {
        setTimeout(createOpenModalEvent(<ModalMessage message={<h3>Вашият акаунт беше успешно активиран!</h3>} />, () => null), 2000);
        this.props.history.push('/login');
      })
      .catch(err => this.setState({
        errors: err
      }));
  }

  render() {
    return (
      <div className="wrapper">
        <div className="content">
          <section className="col-6 col-12-narrower feature">
            <header>
              <h2>Активиране на акаунт</h2>
            </header>
            <div style={{ textAlign: 'center' }}>Моля изчакайте докато системата активира вашият акаунт...</div>
            <div className="error" style={{ textAlign: 'center' }}>{this.state.errors.invalidToken ? 'Невалиден ключ за активация' : null}</div>
          </section>
        </div>
      </div>
    );
  }
}