import React from 'react';

export class RoundRobinBracket extends React.Component {
  render() {
    return (
      <div>
        {this.props.groups.map((group, i) => (
          <BracketGroup key={i} group={group} />
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

  get_match(i, j) {
    let team1Id = this.props.group.teams[i];
    let team2Id = this.props.group.teams[j];
    let match = this.props.group.matches.find(match => match.team1Id === team1Id && match.team2Id === team2Id);

    if (team1Id == team2Id)
      return <div>x</div>;
    else if (match)
      return <div>има среща</div>;
    else return <div>няма среща</div>;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>{`Група "${this.get_header()}"`}</th>
            {this.props.group.teams.map((t, i) => <th key={i}>{t.order}</th>)}
          </tr>
        </thead>
        {this.props.group.teams.map((t1, i) => (
          <tr key={i}>
            <td>
              {`${t1.order}. ${t1.User.fullname}`}
            </td>
            {this.props.group.teams.map((t2, j) => <td key={j}>{this.get_match(i, j)}</td>)}
          </tr>
        ))}
        <tbody>
        </tbody>
      </table>
    );
  }
}