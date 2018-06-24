import React from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationButton, Select } from '../Infrastructure';
import { get } from '../../services/fetch';

export function init_elimination_bracket(matches, refresh_handler) {
  let bracket_size = matches.length * 2;
  let bracket = [];

  for (let i = 0; i < matches.length; i++) {
    bracket[i] = [];
    bracket[i][0] = <EntryBox key={0} match={matches[i]} refresh={refresh_handler} />
  }

  let rounds = Math.log2(bracket_size);
  for (let round = 1; round <= rounds; round++) {
    let power = Math.pow(2, round - 1);
    for (let row = 0; row < matches.length; row += power) {
      bracket[row][round] = <Cell key={round} rowSpan={power} />
    }
  }
  return bracket;
}

export function get_elimination_headers(matches) {
  let bracket_size = matches.length * 2;
  let headers = [];
  while (bracket_size > 1) {
    if (bracket_size == 8)
      headers.push('QF');
    else if (bracket_size == 4)
      headers.push('SF');
    else if (bracket_size == 2)
      headers.push('F');
    else
      headers.push('R' + bracket_size);

    bracket_size /= 2;
  }

  if (matches.length)
    headers.push('Winner');
  return headers;
}


const Cell = ({ rowSpan }) => {
  return (<td rowSpan={rowSpan}><div className="cell"></div></td>);
}

export class EntryBox extends React.Component {
  removeTeam(pos) {
    get(`/matches/${this.props.match.id}/removeTeam?pos=${pos}`)
      .then(() => this.props.refresh());
  }

  setTeam(pos, teamId) {
    get(`/matches/${this.props.match.id}/setTeam?pos=${pos}&teamId=${teamId}`)
      .then(() => this.props.refresh());
  }

  render() {
    return (
      <td>
        <div className="td-container">
          <div className="button h2h">h2h</div>
          <table className="match-table">
            <tbody>
              <tr>
                <td className="number">{this.props.match.match * 2 - 1}</td>
                <td className="seed">{this.props.match.seed1 ? `(${this.props.match.seed1})` : null}</td>
                <td>
                  <TeamLabel team={this.props.match.team1}
                    onRemove={() => this.removeTeam(1)}
                    onChange={team => this.setTeam(1, team.id)} />
                </td>
              </tr>
              <tr>
                <td>{this.props.match.match * 2}</td>
                <td className="seed">{this.props.match.seed2 ? `(${this.props.match.seed2})` : null}</td>
                <td className="delim">
                  <TeamLabel team={this.props.match.team2}
                    onRemove={() => this.removeTeam(2)}
                    onChange={team => this.setTeam(2, team.id)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    );
  }
}

export class MatchScore extends React.Component {
  render() {
    return <div></div>
  }
}

export class TeamLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTeam: true,
      selected: null
    }
  }

  setTeam() {
    this.setState({ selected: null });
    this.props.onChange(this.state.selected);
  }

  render() {
    if (this.props.team)
      return (
        <React.Fragment>
          <Link to={`/baba`}>{this.props.team.fullname}</Link>
          <span className="button-group">
            <ConfirmationButton onChange={flag => flag ? this.props.onRemove() : null}>
              <i className="fa fa-times"></i>
            </ConfirmationButton>
          </span>
        </React.Fragment>
      );
    else
      if (this.state.selectTeam)
        return (
          <React.Fragment>
            <a onClick={() => this.setState({ selectTeam: false })}>{this.state.selected ? this.state.selected.name : "bye"}</a>
            {this.state.selected ?
              <span className="button-group">
                <ConfirmationButton onChange={flag => flag ? this.setTeam() : null}>
                  <i className="fa fa-plus"></i>
                </ConfirmationButton>
              </span> : null
            }
          </React.Fragment>
        );
      else
        return (
          <Select value={this.state.selected ? this.state.selected.id : 0}
            url={`/schemes/2/queue`}
            onChange={team => this.setState({ selectTeam: true, selected: team })}>
            <option value={0}>bye</option>
          </Select>
        );
  }
}