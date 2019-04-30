import React from 'react';
import { get } from '../services/fetch';

export default class PaymentPending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentId: props.match.params.id
    }
  }

  componentDidMount() {
    get(`/api/payments/${this.props.match.params.id}/pending`)
      .then(e => this.props.match.history.push(`/schemes/${e.schemeId}`));
  }

  render() {
    return (
      <div className="wrapper">
        <section className="container">
          <h2 style={{ display: 'center' }}>Моля изчакайте докато обработваме заявката Ви.</h2>
        </section>
      </div>
    );
  }
}