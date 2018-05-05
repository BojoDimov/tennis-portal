import React, { Component } from 'react';

export class CreateTournamentEdition extends Component {
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
    return <div className="margin border">
      <h4 className="margin">Ново издание</h4>
      <div className="margin">
        <div>Име</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div className="margin">
        <div>Допълнителна иформация</div>
        <input
          type="text"
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin">
        <div>Начало на турнира</div>
        <input type="date"
          value={this.state.startDate}
          onChange={e => this.setState({ startDate: e.target.value })} />
      </div>
      <div className="margin">
        <div>Край на турнира</div>
        <input type="date"
          value={this.state.endDate}
          onChange={e => this.setState({ endDate: e.target.value })} />
      </div>
      <div className="margin">
        <button onClick={() => this.create()} disabled={!this.validate()}>Готово</button>
      </div>
    </div>;
  }

  create() {
    let request = new Request('http://localhost:3100/api/tournament/editions', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    fetch(request).then(res => console.log(res));
  }

  validate() {
    return true;
  }
}