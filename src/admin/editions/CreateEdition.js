import React, { Component } from 'react';
import { ActionButton, Select } from '../Infrastructure';
import { post } from '../../services/fetch';

export class CreateEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      tournamentId: undefined,
      startDate: new Date(),
      endDate: new Date(),
      errors: {}
    };
  }

  create() {
    return post('/editions', this.state)
      .then(({ id }) => {
        this.setState({ id });
        this.props.onChange();
      })
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return <div className="margin container-fluid">
      <h2 className="headline">Ново издание</h2>
      <div className="margin input">
        <div>Име</div>
        <input
          type="text"
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })} />
        <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
      </div>
      <div className="margin input">
        <div>Допълнителна иформация</div>
        <textarea
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Турнир</div>
        <Select url="/tournaments" onChange={id => this.setState({ tournamentId: id })} />
      </div>
      <div className="margin input">
        <div>Начало на турнира</div>
        <input type="date"
          value={this.state.startDate}
          onChange={e => this.setState({ startDate: e.target.value })} />
        <div className="error">{this.state.errors.startDateEndDate ? '*Началната дата трябва да бъде преди крайната дата' : null}</div>
      </div>
      <div className="margin input">
        <div>Край на турнира</div>
        <input type="date"
          value={this.state.endDate}
          onChange={e => this.setState({ endDate: e.target.value })} />
        <div className="error">{this.state.errors.startDateEndDate ? '*Началната дата трябва да бъде преди крайната дата' : null}</div>
      </div>
      <ActionButton className="margin input"
        onSuccess={`/editions/view/${this.state.id}`}
        onClick={() => this.create()}>Готово</ActionButton>
    </div>;
  }
}