import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ActionButton } from '../Infrastructure';
import { post } from '../../services/fetch';

export class CreateTournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      redirect: false
    };
  }

  render() {
    return (
      <div className="margin container-fluid">
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
        <ActionButton className="margin input"
          onSuccess='/tournaments'
          onClick={() => this.create()}>Готово</ActionButton>
      </div>
    );
  }

  create() {
    return post('/tournaments', this.state);
  }

  validate() {
    return true;
  }
}