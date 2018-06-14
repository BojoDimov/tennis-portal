import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, Select } from '../Infrastructure';
import { get, post } from '../../services/fetch';

export class EditEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      startDate: new Date(),
      endDate: new Date(),
      errors: {}
    };
  }

  componentDidMount() {
    return get(`/editions/${this.props.match.params.id}`)
      .then(res => {
        this.setState(res);
        this.setState({ errors: {} });
      });
  }

  update() {
    return post('/editions/edit', this.state, 'Промяната е успешна')
      .then(({ id }) => {
        console.log('success');
        //this.setState({ id: id });
        //this.props.onChange()
      })
      .catch(err => {
        this.setState({ errors: err });
        throw err;
      });
  }

  render() {
    return <div className="form-container">
      <h2 className="form-box">Промяна на издание</h2>
      <form className="form-box">
        {/* <div className="input-group">
          <Link to={`/tournaments/view/${this.state.tournamentId}`}>
            {this.state.tournamentName}
          </Link>
        </div> */}
        <div className="input-group">
          <div>Име</div>
          <input
            type="text"
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })} />
          <div className="error">{this.state.errors.name ? '*Задължително поле' : null}</div>
        </div>
        <div className="input-group">
          <div>Допълнителна иформация</div>
          <textarea
            value={this.state.info}
            onChange={e => this.setState({ info: e.target.value })} />
        </div>
        <div className="input-group">
          <div>Начало на турнира</div>
          <input type="date"
            value={this.state.startDate}
            onChange={e => this.setState({ startDate: e.target.value })} />
          <div className="error">{this.state.errors.startDateEndDate ? '*Началната дата трябва да бъде преди крайната дата' : null}</div>
        </div>
        <div className="input-group">
          <div>Край на турнира</div>
          <input type="date"
            value={this.state.endDate}
            onChange={e => this.setState({ endDate: e.target.value })} />
          <div className="error">{this.state.errors.startDateEndDate ? '*Началната дата трябва да бъде преди крайната дата' : null}</div>
        </div>
        <ActionButton className="center"
          onSuccess={`/editions/view/${this.state.id}`}
          onClick={() => this.update()}>
          Готово
          </ActionButton>
      </form>
    </div>;
  }
}