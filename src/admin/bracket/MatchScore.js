import React from 'react';
import { post } from '../../services/fetch';

export class MatchScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMatchForm: false,
      sets: this.initSets()
    }
  }

  initSets() {
    let sets = [];
    for (let i = 0; i < 5; i++)
      sets.push({
        matchId: 0,
        order: i + 1,
        team1: '',
        team2: '',
        disabled: true
      });

    sets[0].disabled = false;
    return sets;
  }

  handle_input(value, index, pos) {
    let sets = this.state.sets;
    sets[index]['team' + pos] = value;
    if (index < (5 - 1) && sets[index].team1 !== '' && sets[index].team2 !== '')
      sets[index + 1].disabled = false;

    if (index < (5 - 1) && (sets[index].team1 === '' || sets[index].team2 === ''))
      sets[index + 1].disabled = true;

    this.setState({ sets: sets });
  }

  render() {
    if (!this.props.match.team1Id || !this.props.match.team2)
      return null;
    else
      return (
        <div className="dropdown">
          <div className="button h2h" onClick={() => this.setState({ showMatchForm: !this.state.showMatchForm })}>h2h</div>
          {this.state.showMatchForm ?
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
                    <td>{this.props.match.team1.fullname}</td>
                    {this.state.sets.map((set, i) => (
                      <td key={i}><input type="text" disabled={set.disabled} value={set.team1} onChange={(e) => this.handle_input(e.target.value, i, 1)} /></td>
                    ))}
                  </tr>
                  <tr>
                    <td>{this.props.match.team2.fullname}</td>
                    {this.state.sets.map((set, i) => (
                      <td key={i}><input type="text" disabled={set.disabled} value={set.team2} onChange={(e) => this.handle_input(e.target.value, i, 2)} /></td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="input-group">
                <div>Отказал се</div>
                <select value={0}>
                  <option value={0}>нямa</option>
                  <option value={this.props.match.team1Id}>{this.props.match.team1.fullname}</option>
                  <option value={this.props.match.team2Id}>{this.props.match.team2.fullname}</option>
                </select>
              </div>
              <div className="button center" onClick={() => this.setState({ showMatchForm: false })}>Запис на резултата</div>
            </div>
            : null}
        </div>
      );
  }
}