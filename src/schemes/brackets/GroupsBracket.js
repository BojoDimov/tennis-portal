import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import './styles.scss';
import { ApplicationMode } from '../../enums';
import UserService from '../../services/user.service';
import QueryService from '../../services/query.service';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EditGroupModal from './EditGroupModal';
import EditMatchModal from '../components/MatchFormModal';
import { BracketStatus } from '../../enums';

class GroupsBracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      scheme: {
        edition: {}
      },
      groupModel: null,
      matchModel: null,
      enableActions: false
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService.get(`/schemes/${this.props.match.params.id}/matches/groups`)
      .then(({ groups, scheme }) => this.setState({
        groups,
        scheme,
        enableActions: scheme.bracketStatus == BracketStatus.GROUPS_DRAWN || scheme.bracketStatus == BracketStatus.GROUPS_END
      }));
  }

  addGroup() {
    this.setState({
      groupModel: {
        group: this.state.groups.length,
        teams: [],
        matches: [],
        schemeId: this.state.scheme.id
      }
    });
  }

  addMatch(group) {
    this.setState({
      matchModel: {
        groupId: group.id,
        schemeId: this.state.scheme.id,
        sets: []
      }
    })
  }

  deleteGroup(group) {
    return QueryService
      .delete(`/schemes/${group.schemeId}/groups/${group.id}`)
      .then(() => this.getData());
  }

  deleteMatch(match) {
    return QueryService
      .delete(`/schemes/${match.schemeId}/matches/${match.id}`)
      .then(() => this.getData());
  }

  render() {
    const { scheme, groups, groupModel, matchModel, enableActions } = this.state;

    return (
      <UserService.WithApplicationMode>
        {mode => {
          let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

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

              {matchModel
                && <EditMatchModal
                  model={matchModel}
                  onChange={() => {
                    this.getData();
                    this.setState({ matchModel: null })
                  }}
                  onClose={() => this.setState({ matchModel: null })}
                />}

              <Typography align="center" variant="headline">
                Групова фаза за
              <Link to={`/editions/${scheme.edition.id}`}>
                  <Typography variant="display1">{scheme.edition.name}</Typography>
                </Link>
                -
              <Link to={`/schemes/${scheme.id}`}>
                  <Typography variant="display1">{scheme.name}</Typography>
                </Link>
              </Typography>

              {hasPermission && enableActions
                && <div style={{ margin: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" size="small" onClick={() => this.addGroup()}>Добави група</Button>
                </div>}

              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem', flexWrap: 'wrap' }}>
                {groups.map(group => {
                  return (
                    <Group
                      key={group.id}
                      group={group}
                      hasPermission={hasPermission}
                      onEdit={() => this.setState({ groupModel: group })}
                      onDelete={() => this.deleteGroup(group)}
                      onAddMatch={() => this.addMatch(group)}
                      onEditMatch={(match) => this.setState({ matchModel: match })}
                      onDeleteMatch={(match) => this.deleteMatch(match)}
                      enableActions={enableActions}
                    />
                  );
                })}
              </div>
            </Paper>
          );
        }}
      </UserService.WithApplicationMode>

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
    const { hasPermission, group, onEdit, onDelete, onAddMatch, onEditMatch, onDeleteMatch, enableActions } = this.props;
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

        <div style={{ padding: '1.5rem', flexGrow: 1, transition: 'flex-grow .3s ease-out' }}>
          {tabIndex == 0 && <GroupRankingView groupTeams={group.teams} />}
          {tabIndex == 1 && <GroupMatchesView hasPermission={hasPermission} matches={group.matches} onEditMatch={onEditMatch} onDeleteMatch={onDeleteMatch} />}
        </div>

        {hasPermission && enableActions
          && <div style={{ display: 'flex', padding: '1.5rem' }}>
            <Button variant="contained" color="primary" size="small" onClick={onEdit}>Промяна</Button>
            <Button variant="contained" color="primary" size="small" onClick={onAddMatch} style={{ margin: '0 .3rem' }}>Добавяне на мач</Button>
            <ConfirmationDialog
              title="Изтриване на група"
              body={<Typography>Сигурни ли сте че искате да група "{this.getGroupHeader(group.group)}"?</Typography>}
              onAccept={onDelete}
            >
              <Button variant="contained" color="secondary" size="small">Изтриване</Button>
            </ConfirmationDialog>
          </div>}
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
          <Typography style={{ flexBasis: '4rem', fontStyle: 'italic' }}>W - L</Typography>
        </div>
        {groupTeams.map(groupTeam => {
          return (
            <GroupTeamInfo key={groupTeam.id} team={groupTeam.team} rank={groupTeam.order} stats={groupTeam.stats} />
          );
        })}
      </div>
    );
  }
}

class GroupMatchesView extends React.Component {
  render() {
    const { hasPermission, matches, onEditMatch, onDeleteMatch } = this.props;

    if (!matches || !matches.length)
      return (<Typography variant="caption" align="center">Няма изиграни мачове</Typography>);

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {matches.map(match => {
          return (
            <div key={match.id} style={{ padding: '0.3rem 0', display: 'flex', width: '100%', justifyContent: 'space-between', borderBottom: '1px solid lightgrey' }}>
              <div style={{ margin: '0 .2rem' }}>
                <Typography>
                  {match.team1.user1.name}
                </Typography>
                {match.team1.user2
                  && <Typography>
                    {match.team1.user2.name}
                  </Typography>}
              </div>
              <Typography variant="caption" align="center">
                {match.sets.map(set => {
                  return (
                    <span key={set.id} style={{ marginRight: '.3rem' }}>
                      {set.team1}
                      {set.team2}
                      {set.tiebreaker && <sup>({set.tiebreaker})</sup>}
                    </span>
                  );
                })}
              </Typography>
              <div style={{ margin: '0 .2rem' }}>
                <Typography>
                  {match.team2.user1.name}
                </Typography>
                {match.team2.user2
                  && <Typography>
                    {match.team2.user2.name}
                  </Typography>}
              </div>

              {hasPermission && <div>
                <EditIcon color="primary" style={{ cursor: 'pointer' }} onClick={() => onEditMatch(match)}></EditIcon>
                <ConfirmationDialog
                  title="Изтриване на мач"
                  body={<Typography>Сигурни ли сте че искате да изтриете мача?</Typography>}
                  onAccept={() => onDeleteMatch(match)}
                >
                  <DeleteForeverIcon color="secondary" style={{ cursor: 'pointer' }}></DeleteForeverIcon>
                </ConfirmationDialog>
              </div>}
            </div>
          );
        })}
      </div>
    );
  }
}

class GroupTeamInfo extends React.Component {
  render() {
    const { team, rank, stats } = this.props;
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
          <span style={{ marginRight: '.3rem', fontStyle: 'italic' }}>{stats.wonMatches}</span>
          -
          <span style={{ marginLeft: '.3rem', fontStyle: 'italic' }}>{stats.totalMatches - stats.wonMatches}</span>
        </Typography>
      </div>
    );
  }
}

export default GroupsBracket;