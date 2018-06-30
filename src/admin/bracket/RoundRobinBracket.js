import React from 'react';
import { TeamLabel } from './TeamLabel';
import { Score } from './Score';
import { MatchScore2 } from './MatchScore';
import { get } from '../../services/fetch';

export class RoundRobinBracket extends React.Component {
  render() {
    return (
      <div>
        {this.props.groups.map((group, i) => (
          <BracketGroup key={i} group={group} refresh={this.props.refresh} />
        ))}
      </div>
    );
  }
}


function get_group_header(group) {
  return String.fromCharCode("А".charCodeAt(0) + group);
}

export class BracketGroup extends React.Component {
  get_header() {
    return String.fromCharCode("А".charCodeAt(0) + this.props.group.group);
  }

  isReversed(team1Id, team2Id) {
    return this.props.group.matches.find(e => e.team1Id == team2Id && e.team2Id == team1Id);
  }

  getMatch(t1, t2) {
    console.log(t1, t2);
    let match = this.props.group.matches.find(e => e.team1Id == t1.team1Id && e.team2Id == t2.team2Id);
    let reversed = this.isReversed(t1.team1Id, t2.team2Id);

    if (match)
      return match;
    else if (reversed)
      return reversed;
    else return {
      groupId: this.props.group.id,
      schemeId: this.props.group.schemeId,
      team1Id: t1.team1Id,
      team2Id: t2.team2Id,
      team1: t1.User,
      team2: t2.User,
      sets: []
    };
  }

  getSets(t1, t2) {
    let match = this.getMatch(t1, t2);

    if (match)
      return match.sets;
    else
      return [];
  }



  removeTeam(t) {
    get(`/groups/${this.props.group.id}/removeTeam?teamId=${t.id}`)
      .then(() => this.props.refresh());
  }

  addTeam(gt, t) {
    get(`/groups/${this.props.group.id}/addTeam?teamId=${t.id}&groupTeamId=${gt.id}`)
      .then(() => this.props.refresh());
  }

  render() {
    return (
      <table className="round-robin-table">
        <thead>
          <tr>
            <th>{`Група "${this.get_header()}"`}</th>
            {this.props.group.teams.map((t, i) => <th key={i}>{t.order}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.props.group.teams.map((t1, i) => (
            <tr key={i}>
              <td className="team-label">
                <span>{`${t1.order}. `}</span>
                <TeamLabel team={t1.User}
                  schemeId={this.props.group.schemeId}
                  onRemove={() => this.removeTeam(t1.User)}
                  onChange={team => this.addTeam(t1, team)} />
              </td>
              {this.props.group.teams.map((t2, j) => (
                <td key={j}>
                  {i == j ? <span>x</span> :
                    <React.Fragment>
                      <Score
                        sets={this.getSets(t1, t2)}
                        reversed={this.isReversed(t1.team1Id, t2.team2Id)}
                      />
                      <MatchScore2 match={this.getMatch(t1, t2)} refresh={this.props.refresh} />
                    </React.Fragment>
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}