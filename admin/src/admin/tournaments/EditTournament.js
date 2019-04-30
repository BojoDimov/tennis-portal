import React, { Component } from 'react';
import { ActionButton } from '../Infrastructure';
import { get, post } from '../../services/fetch';

export class EditTournament extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      errors: {}
    };
  }

  componentDidMount() {
    return get(`/tournaments/${this.props.match.params.id}`)
      .then(res => {
        this.setState(res);
        this.setState({ errors: {} });
      });
  }

  update() {
    return post('/tournaments/edit', this.state, 'Промяната е успешна')
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box">Промяна на турнир</h2>
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
            onClick={() => this.update()}>Готово</ActionButton>
        </form>
      </div>
    );
  }
}