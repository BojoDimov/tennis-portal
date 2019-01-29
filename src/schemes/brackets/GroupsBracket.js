import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import './styles.scss';
import QueryService from '../../services/query.service';
import EditGroupModal from './EditGroupModal';

class GroupsBracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      scheme: {
        edition: {}
      },
      groupModel: null
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
    const { scheme, groups, groupModel } = this.state;

    return (
      <Paper elevation={4} style={{ padding: '2rem 0 3rem 0', backgroundColor: 'rgba(255, 255, 255, .9)' }}>
        {groupModel
          && <EditGroupModal
            model={groupModel}
            scheme={scheme}
            onChange={() => {
              this.getData();
              this.setState({ groupModel: null })
            }}
            onClose={() => this.setState({ groupModel: null })}
          />}

        <Typography align="center" variant="headline">Групова фаза за {scheme.edition.name} - {scheme.name}</Typography>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem', flexWrap: 'wrap' }}>
          {groups.map(group => {
            return (
              <Group key={group.id} group={group} onEdit={() => this.setState({ groupModel: group })} />
            );
          })}
        </div>
      </Paper>
    );
  }
}

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }

  getGroupHeader(groupOrder) {
    return String.fromCharCode("А".charCodeAt(0) + groupOrder);
  }

  render() {
    const { group, onEdit } = this.props;
    const { tabIndex } = this.state;

    return (
      <Paper elevation={5} className="group-box">
        <div className="group-box-header">
          <Typography variant="headline" style={{ padding: '0 1.5rem' }}>
            {this.getGroupHeader(group.group)}
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={(e, value) => this.setState({ tabIndex: value })}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Класация" />
            <Tab label="Мачове" />
          </Tabs>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {tabIndex == 0 && <GroupRankingView groupTeams={group.teams} />}
          {tabIndex == 1 && <GroupMatchesView matches={group.matches} />}
        </div>
        <Button variant="contained" color="primary" onClick={onEdit}>Промяна</Button>
      </Paper>
    );
  }
}

class GroupRankingView extends React.Component {
  render() {
    const { groupTeams } = this.props;
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography style={{ flexBasis: '4rem', fontStyle: 'italic' }}>W-L</Typography>
        </div>
        {groupTeams.map(groupTeam => {
          return (
            <GroupTeamInfo team={groupTeam.team} rank={groupTeam.order} />
          );
        })}
      </div>
    );
  }
}

class GroupMatchesView extends React.Component {
  render() {
    const { matches } = this.props;
    return (
      <div>
        {matches.length == 0 && <Typography variant="caption" align="center">Няма изиграни мачове</Typography>}
      </div>
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
        <Typography style={{ marginRight: '1rem' }}>{rank}.</Typography>
        <div style={{ flexGrow: 1 }}>
          <Typography>{team.user1.name}</Typography>
          {team.user2 && <Typography>{team.user2.name}</Typography>}
        </div>
        <Typography style={{ flexBasis: '4rem' }}>
          2-1
          </Typography>
      </div>
    );
  }
}

export default GroupsBracket;