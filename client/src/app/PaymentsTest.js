import React from 'react';
import { get } from '../services/fetch';
import { PaymentForm } from './SchemeView';

export default class PaymentsTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payment: null
    }
  }

  componentDidMount() {
    get(`/payments/${this.props.match.params.id}`)
      .then(e => this.setState({ payment: e }));
  }

  render() {
    if (!this.state.payment)
      return null;

    return (
      <PaymentForm
        payment={this.state.payment}
        url={`http://localhost:3000/payments/${this.state.payment.invoice}/test`} />
    );
  }
}