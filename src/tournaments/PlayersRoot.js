import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import TablePagination from '@material-ui/core/TablePagination';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import TeamStatisticsFormModal from './TeamStatisticsFormModal';
import QueryService from '../services/query.service';

class PlayersRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      teamsMode: 'single',
      page: 0,
      itemsPerPage: 10,
      totalCount: 0,
      searchTerm: '',
      editTeamModel: null
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { teamsMode, searchTerm, page, itemsPerPage } = this.state;

    return QueryService.get(`/teams?searchTerm=${searchTerm}&type=${teamsMode}&limit=${itemsPerPage}&offset=${page * itemsPerPage}`)
      .then(({ count, rows }) => {
        this.setState({
          totalCount: count,
          teams: rows
        })
      });
  }

  render() {
    const { teams, totalCount, page, itemsPerPage, searchTerm, teamsMode, editTeamModel } = this.state;

    return (
      <div className="container">
        {editTeamModel && <TeamStatisticsFormModal
          team={editTeamModel}
          onClose={() => this.setState({ editTeamModel: null })}
          onUpdate={() => this.setState({ editTeamModel: null }, () => this.getData())}
        />}

        <Paper style={{ padding: '1rem' }}>
          <Typography variant="headline" color="primary">Вечна класация на играчите</Typography>

          <TextField
            label="Търсене"
            fullWidth
            value={searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value }, () => this.getData())}
          />

          <Tabs
            value={teamsMode}
            onChange={(_, e) => this.setState({ teamsMode: e }, () => this.getData())}
            textColor="primary"
            variant="fullWidth">
            <Tab value="single" label="Сингъл"></Tab>
            <Tab value="double" label="Двойки"></Tab>
          </Tabs>

          <Hidden xsDown>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="dense">#</TableCell>
                  <TableCell>Име</TableCell>
                  <TableCell>Мачове</TableCell>
                  <TableCell>Спечелени мачове</TableCell>
                  <TableCell>Турнири</TableCell>
                  <TableCell>Спечелени турнири</TableCell>
                  <TableCell padding="none"></TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                {teams.map((team, i) => {
                  return (
                    <TableRow key={team.id}>
                      <TableCell padding="dense">{team.globalRank}</TableCell>
                      <TableCell>
                        {!team.user2 && <Typography>{team.user1.name}</Typography>}
                        {team.user2 && <React.Fragment>
                          <Typography>{team.user1.name}</Typography>
                          <Typography>{team.user2.name}</Typography>
                        </React.Fragment>}
                      </TableCell>
                      <TableCell>{team.totalMatches}</TableCell>
                      <TableCell>{team.wonMatches}</TableCell>
                      <TableCell>{team.totalTournaments}</TableCell>
                      <TableCell>{team.wonTournaments}</TableCell>
                      <TableCell padding="none">
                        <IconButton color="primary" onClick={() => this.setState({ editTeamModel: team })}>
                          <EditIcon />
                        </IconButton></TableCell>
                    </TableRow>);
                })}
              </TableBody>
            </Table>
          </Hidden>

          <Hidden smUp>
            <List>
              {teams.map(team => {
                return (
                  <div key={team.id}>
                    <ListItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2">Име Фамилия</Typography>
                      <Typography variant="caption">Турнири: 58 / 400 (14.5% win ratio)</Typography>
                      <Typography variant="caption">Мачове: 58 / 400 (14.5% win ratio)</Typography>
                      <Button variant="contained" size="small" color="primary">Промяна</Button>
                    </ListItem>
                    <Divider />
                  </div>
                );
              })}
            </List>
          </Hidden>

          <TablePagination
            component="div"
            count={totalCount}
            rowsPerPage={itemsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Покажи:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} от ${count}`}
            page={page}
            onChangePage={(e, page) => this.setState({ page }, () => this.getData())}
            onChangeRowsPerPage={e => this.setState({ itemsPerPage: e.target.value, page: 0 }, () => this.getData())}
          />
        </Paper>
      </div>
    )
  }
}

export default PlayersRoot;