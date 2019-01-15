import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';

import UsersTable from './UsersTable';
import SingleTeamsTable from './SingleTeamsTable';
import DoubleTeamsTable from './DoubleTeamsTable';
import UsersCreate from './UsersCreate';
import TeamsCreate from './TeamsCreate';
import QueryService from '../services/query.service';
import UserService from '../services/user.service';


class UsersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleTeams: [],
      doubleTeams: [],
      usersFilter: '',
      users: [],
      isAdmin: UserService.isAdmin()
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    QueryService
      .get(`/teams`)
      .then(e => this.setState({
        singleTeams: e.filter(t => !t.user2Id),
        doubleTeams: e.filter(t => t.user2Id)
      }));

    QueryService
      .get('/users')
      .then(e => this.setState({ users: e }));
  }

  filterUsers() {
    if (this.state.usersFilter.length > 0)
      return this.state.users.filter(e => e.name.indexOf(this.state.usersFilter) != -1);
    else return this.state.users;
  }

  render() {
    const {
      isAdmin,
      singleTeams, doubleTeams,
      usersFilter, users
    } = this.state;

    return (
      <div className="container">
        {isAdmin && <React.Fragment>
          <UsersCreate />
          <TeamsCreate users={users} />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Потребители</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <TextField
                  label="Търсене по име"
                  value={usersFilter}
                  fullWidth={true}
                  onChange={(e) => this.setState({ usersFilter: e.target.value })}
                />
              </div>

              <UsersTable users={this.filterUsers()} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </React.Fragment>}

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography >Играчи</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SingleTeamsTable teams={singleTeams} />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Двойки</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <DoubleTeamsTable teams={doubleTeams} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default UsersView;