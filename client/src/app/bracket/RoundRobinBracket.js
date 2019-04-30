import React from 'react';
import { TeamLabel } from './TeamLabel';
import { Score } from './Score';
import { MatchScore } from './MatchScore';
import { get } from '../../services/fetch';

export class RoundRobinBracket extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
    let match = this.props.group.matches.find(e => e.team1Id == t1.teamId && e.team2Id == t2.teamId);
    let reversed = this.isReversed(t1.teamId, t2.teamId);

    if (match)
      return match;
    else if (reversed)
      return reversed;
    else return {
      groupId: this.props.group.id,
      schemeId: this.props.group.schemeId,
      team1Id: t1.teamId,
      team2Id: t2.teamId,
      team1: t1.User,
      team2: t2.User,
      sets: []
    };
  }

  getScore(t1, t2) {
    let match = this.props.group.matches.find(e => e.team1Id == t1.teamId && e.team2Id == t2.teamId);
    let reversed = this.isReversed(t1.teamId, t2.teamId);
    let isReversed = !match && reversed;
    if (isReversed)
      match = reversed;

    let withdraw = null;
    let c1 = 1, c2 = 1;
    if (isReversed) {
      c1 = 2;
      c2 = 1 / 2;
    }

    if (match && match.withdraw == 1 * c1)
      withdraw = t1.order;
    else if (match && match.withdraw == 2 * c2)
      withdraw = t2.order;

    return {
      sets: match ? match.sets : [],
      withdraw: withdraw,
      reversed: isReversed
    }
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
            {this.props.group.teams.map((t, i) => <th key={i} className="center">{t.order}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.props.group.teams.map((t1, i) => (
            <tr key={i}>
              <td className="team-label" style={{ display: 'flex' }}>
                <div>{`${t1.order}. `}</div>
                <div style={{ marginLeft: '.5rem' }}><TeamLabel team={t1.team} schemeId={this.props.group.schemeId} /></div>
              </td>
              {this.props.group.teams.map((t2, j) => (
                <td key={j} style={{ minWidth: '4rem' }}>
                  {i == j ? <span>x</span> :
                    <React.Fragment>
                      <Score {...this.getScore(t1, t2) } />
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

// sets = { this.getSets(t1, t2) }
// withdraw = { this.getMatch(t1, t2).withdraw }
// reversed = { this.isReversed(t1.teamId, t2.teamId) }