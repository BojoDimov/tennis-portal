import React from 'react';
import { get } from '../../services/fetch';
import { TeamLabel } from './TeamLabel';
import { MatchScore } from './MatchScore';

export class EliminationEntryBox extends React.Component {
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
          <table className="match-table">
            <tbody>
              <tr>
                <td className="number">{this.props.match.match * 2 - 1}</td>
                <td className="seed">{this.props.match.seed1 ? `(${this.props.match.seed1})` : null}</td>
                <td>
                  <TeamLabel team={this.props.match.team1}
                    schemeId={this.props.match.schemeId}
                    onRemove={() => this.removeTeam(1)}
                    onChange={team => this.setTeam(1, team.id)} />
                </td>
              </tr>
              <tr>
                <td>{this.props.match.match * 2}</td>
                <td className="seed">{this.props.match.seed2 ? `(${this.props.match.seed2})` : null}</td>
                <td className="delim">
                  <TeamLabel team={this.props.match.team2}
                    schemeId={this.props.match.schemeId}
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