import React, { Component } from 'react';
import { post } from '../../services/fetch';

export class CreateTournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: ''
    };
  }

  render() {
    return <div className="margin container">
      <h2 className="section">Нов турнир</h2>
      <div className="margin input">
        <div>Име</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Описание</div>
        <textarea
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin input">
        <span className="button" onClick={() => this.create()} disabled={!this.validate()}>Готово</span>
      </div>
    </div>;
  }

  create() {
    return post('/tournaments', this.state)
      .then(res => console.log(res));
  }

  validate() {
    return true;
  }
}