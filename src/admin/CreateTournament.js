import React, { Component } from 'react';

export class CreateTournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: ''
    };
  }

  render() {
    return <div className="margin border">
      <h4 className="margin">Нов турнир</h4>
      <div className="margin">
        <div>Име</div>
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })} />
      </div>
      <div className="margin">
        <div>Описание</div>
        <input
          type="text"
          value={this.state.info}
          onChange={e => this.setState({ info: e.target.value })} />
      </div>
      <div className="margin">
        <button onClick={() => this.create()} disabled={!this.validate()}>Готово</button>
      </div>
    </div>;
  }

  create() {
    request('http://localhost:3100/api/tournaments', this.state)
      .then(res => console.log(res));
  }

  validate() {
    return true;
  }
}

function request(url, data) {
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
  }).then(response => response.json())
}