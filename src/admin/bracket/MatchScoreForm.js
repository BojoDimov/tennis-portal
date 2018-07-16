import React from 'react';
import { ConfirmationButton } from '../Infrastructure';
import { post } from '../../services/fetch';

export class MatchScoreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sets: this.initSets(),
      withdraw: 0
    }
  }

  initSets() {
    let sets = [];
    for (let i = 0; i < 5; i++)
      sets.push({
        order: i + 1,
        team1: '',
        team2: '',
        disabled: true
      });

    sets[0].disabled = false;
    return sets;
  }

  componentDidMount() {
    console.log(this.props.match);
    let sets = this.state.sets;
    this.props.match.sets.forEach((set, i) => {
      set.disabled = false;
      sets[i] = set;
      if (i < sets.length - 1)
        sets[i + 1].disabled = false;
    });

    this.setState({ sets: sets, withdraw: this.props.match.withdraw });
  }

  handle_input(value, index, pos) {
    let sets = this.state.sets;
    sets[index]['team' + pos] = value;
    if (index < (5 - 1) && sets[index].team1 !== '' && sets[index].team2 !== '')
      //sets.slice(index + 1).forEach(set => set.disabled = false);
      sets[index + 1].disabled = false;

    // if (index < (5 - 1) && (sets[index].team1 === '' || sets[index].team2 === ''))
    //   sets.slice(index + 1).forEach(set => set.disabled = true);
    // sets[index + 1].disabled = true;

    this.setState({ sets: sets });
  }

  saveMatch() {
    if (this.props.match.id)
      return post(`/matches/${this.props.match.id}`, { sets: this.state.sets, withdraw: this.state.withdraw })
        .then((res) => this.props.onChange(res));
    else {
      let match = this.props.match;
      match.withdraw = this.state.withdraw;
      match.sets = this.state.sets;
      return post(`/matches`, match)
        .then((res) => this.props.onChange(res));
    }
  }

  render() {
    return (
      <div className="dropdown-content">
        <table className="match-result-table input-group">
          <thead>
            <tr>
              <th></th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>V</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.match.team1.user1.name}</td>
              {this.state.sets.map((set, i) => (
                <td key={i}><input type="text" disabled={set.disabled} value={set.team1} onChange={(e) => this.handle_input(e.target.value, i, 1)} /></td>
              ))}
            </tr>
            <tr>
              <td>{this.props.match.team2.user1.name}</td>
              {this.state.sets.map((set, i) => (
                <td key={i}><input type="text" disabled={set.disabled} value={set.team2} onChange={(e) => this.handle_input(e.target.value, i, 2)} /></td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="input-group">
          <div>Отказал се</div>
          <select value={this.state.withdraw} onChange={e => this.setState({ withdraw: e.target.value })}>
            <option value={0}>нямa</option>
            <option value={1}>{this.props.match.team1.user1.name}</option>
            <option value={2}>{this.props.match.team2.user1.name}</option>
          </select>
        </div>
        <ConfirmationButton className="button-block center" onChange={flag => flag ? this.saveMatch() : null}>
          Запис на резултата
        </ConfirmationButton>
      </div>
    );
  }
}