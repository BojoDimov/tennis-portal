import React, { Component } from 'react';
import { ActionButton } from '../Infrastructure';
import { post } from '../../services/fetch';

export class CreateTournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      errors: {}
    };
  }
  create() {
    return post('/tournaments', this.state, 'Турнирът е успешно създаден')
      .then(({ id }) => {
        this.setState({ id: id });
        this.props.onChange()
      })
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box">Нов турнир</h2>
        <form className="form-box">
          <div className="input-group">
            <div>Име</div>
            <input
              type="text"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })} />
            <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
          </div>
          <div className="input-group">
            <div>Описание</div>
            <textarea
              value={this.state.info}
              onChange={e => this.setState({ info: e.target.value })} />
          </div>
          <ActionButton className="center"
            onSuccess={`/tournaments/view/${this.state.id}`}
            onClick={() => this.create()}>Готово</ActionButton>
        </form>
      </div>
    );
  }
}