import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, Select } from '../Infrastructure';
import { get, post } from '../../services/fetch';

export class CreateEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  componentDidMount() {
    let tournamentId = new URLSearchParams(this.props.location.search).get('tournamentId');
    get(`/tournaments/${tournamentId}`)
      .then(t => this.setState({
        tournamentName: t.name,
        tournamentId: tournamentId
      }));
  }

  create() {
    return post('/editions', this.state, 'Изданието е успешно създадено')
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
    return <div className="form-container">
      <h2 className="form-box">Ново издание</h2>
      <form className="form-box">
        <div className="input-group">
          <Link to={`/tournaments/view/${this.state.tournamentId}`}>
            {this.state.tournamentName}
          </Link>
        </div>
        <div className="input-group">
          <div>Име</div>
          <input
            type="text"
            onChange={(e) => this.setState({ name: e.target.value })} />
          <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
        </div>
        <div className="input-group">
          <div>Допълнителна иформация</div>
          <textarea
            onChange={e => this.setState({ info: e.target.value })} />
        </div>
        <div className="input-group">
          <div>Начало на турнира</div>
          <input type="date"
            onChange={e => this.setState({ startDate: e.target.value })} />
          <div className="error">{this.state.errors.startDateEndDate ? '*Началната дата трябва да бъде преди крайната дата' : null}</div>
        </div>
        <div className="input-group">
          <div>Край на турнира</div>
          <input type="date"
            onChange={e => this.setState({ endDate: e.target.value })} />
          <div className="error">{this.state.errors.startDateEndDate ? '*Началната дата трябва да бъде преди крайната дата' : null}</div>
        </div>
        <ActionButton className="center"
          onSuccess={`/editions/view/${this.state.id}`}
          onClick={() => this.create()}>
          Готово
          </ActionButton>
      </form>
    </div>;
  }
}