import React, { Component } from 'react';
import { post } from '../../services/fetch';

export class CreateEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      startDate: new Date(),
      endDate: new Date()
    };
  }

  render() {
    return <div className="margin container-fluid">
      <h2 className="section">Ново издание</h2>
      <div className="margin input">
        <div>Име</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Допълнителна иформация</div>
        <textarea
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Начало на турнира</div>
        <input type="date"
          value={this.state.startDate}
          onChange={e => this.setState({ startDate: e.target.value })} />
      </div>
      <div className="margin input">
        <div>Край на турнира</div>
        <input type="date"
          value={this.state.endDate}
          onChange={e => this.setState({ endDate: e.target.value })} />
      </div>
      <div className="margin input">
        <span className="button" onClick={() => this.create()} disabled={!this.validate()}>Готово</span>
      </div>
    </div>;
  }

  create() {
    // return post('/tournaments/editions', this.state)
    //   .then(res => console.log(res));
  }

  validate() {
    return true;
  }
}