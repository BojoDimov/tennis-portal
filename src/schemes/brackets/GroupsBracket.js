import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './styles.scss';
import QueryService from '../../services/query.service';

class GroupsBracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      scheme: {
        edition: {}
      }
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService.get(`/schemes/${this.props.match.params.id}/matches/groups`)
      .then(e => this.setState({
        groups: e.groups,
        scheme: e.scheme
      }));
  }

  render() {
    const { scheme, groups } = this.state;

    return (
      <Paper elevation={4} style={{ minHeight: '300px', backgroundColor: 'rgba(255, 255, 255, .9)' }}>
        <Typography align="center" variant="headline">Групова фаза за {scheme.edition.name} - {scheme.name}</Typography>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
          {groups.map(group => {
            return (
              <Group key={group.id} group={group} />
            );
          })}
        </div>
      </Paper>
    );
  }
}

class Group extends React.Component {
  render() {
    const { group } = this.props;
    return (
      <Paper elevation={10} className="group-box">
        <div>{group.group}</div>
        {group.teams.map(groupTeam => {
          return (
            <GroupTeamInfo team={groupTeam.team} rank={groupTeam.order} />
          );
        })}
      </Paper>
    );
  }
}

class GroupTeamInfo extends React.Component {
  render() {
    const { team, rank } = this.props;
    if (!team)
      return null;

    return (
      <div className="group-box-team-info">
        <span>{rank}.</span>
        <div>
          <Typography>{team.user1.name}</Typography>
          {team.user2 && <Typography>{team.user2.name}</Typography>}
        </div>
      </div>
    );
  }
}

export default GroupsBracket;