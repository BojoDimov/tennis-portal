import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
    const { classes } = this.props;

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
                  <TableCell>Спечелени мачове</TableCell>
                  <TableCell>Общо мачове</TableCell>
                  <TableCell>Спечелени турнири</TableCell>
                  <TableCell>Общо турнири</TableCell>
                  <TableCell padding="none"></TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                {teams.map((team, i) => {
                  let prefix = '';
                  if (team.globalRank === 1)
                    prefix = 'gold'
                  else if (team.globalRank === 2)
                    prefix = 'silver'
                  else if (team.globalRank === 3)
                    prefix = 'bronze'

                  return (
                    <TableRow key={team.id} className={classes[prefix + 'Root']}>
                      <TableCell padding="dense">
                        <Typography className={classes[prefix + 'Typography']}>
                          {team.globalRank}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {!team.user2 && <Typography className={classes[prefix + 'Typography']}>{team.user1.name}</Typography>}
                        {team.user2 && <React.Fragment>
                          <Typography className={classes[prefix + 'Typography']}>{team.user1.name}</Typography>
                          <Typography className={classes[prefix + 'Typography']}>{team.user2.name}</Typography>
                        </React.Fragment>}
                      </TableCell>
                      <TableCell>
                        <Typography className={classes[prefix + 'Typography']}>
                          {team.wonMatches}
                        </Typography></TableCell>
                      <TableCell>
                        <Typography className={classes[prefix + 'Typography']}>
                          {team.totalMatches}
                        </Typography></TableCell>
                      <TableCell>
                        <Typography className={classes[prefix + 'Typography']}>
                          {team.wonTournaments}
                        </Typography></TableCell>
                      <TableCell>
                        <Typography className={classes[prefix + 'Typography']}>
                          {team.totalTournaments}
                        </Typography>
                      </TableCell>
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
                let prefix = '';
                if (team.globalRank === 1)
                  prefix = 'gold'
                else if (team.globalRank === 2)
                  prefix = 'silver'
                else if (team.globalRank === 3)
                  prefix = 'bronze'

                return (
                  <div key={team.id} >
                    <ListItem style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className={classes[prefix + 'Root']} style={{ borderRadius: '50%', border: '1px solid lightgray', flexBasis: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography className={classes[prefix + 'Typography']}>#{team.globalRank}</Typography>
                      </div>
                      <div style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography>{team.user1.name}</Typography>
                        <Typography>Турнири: {team.wonMatches} / {team.totalMatches} ({team.totalMatches != 0 ? team.wonMatches / team.totalMatches : 0}% win ratio)</Typography>
                        <Typography>Турнири: {team.wonTournaments} / {team.totalTournaments} ({team.totalTournaments != 0 ? team.wonTournaments / team.totalTournaments : 0}% win ratio)</Typography>
                        {/* <IconButton color="primary" onClick={() => this.setState({ editTeamModel: team })}>
                          <EditIcon />
                        </IconButton> */}
                      </div>
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

const styles = (theme) => ({
  mobileRoot: {
    display: 'flex'
  },
  goldRoot: {
    backgroundColor: '#facc6b',
    backgroundImage: 'linear-gradient(315deg, #facc6b 0%, #fabc3c 74%)',
    border: 'none'
  },
  goldTypography: {
    fontWeight: 700,
    color: 'whitesmoke',
    fontSize: '1.2em'
  },
  silverRoot: {
    backgroundColor: '#b8c6db',
    backgroundImage: 'linear-gradient(315deg, #8ba2c3 0%, #f5f7fa 74%)',
    border: 'none'
  },
  silverTypography: {
    fontWeight: 700,
    color: 'dark gray',
    fontSize: '1.2em'
  },
  bronzeRoot: {
    backgroundColor: '#772f1a',
    backgroundImage: 'linear-gradient(315deg, #772f1a 0%, #f2a65a 74%)',
    border: 'none'
  },
  bronzeTypography: {
    fontWeight: 700,
    color: 'whitesmoke',
    fontSize: '1.2em'
  }
});

export default withStyles(styles)(PlayersRoot);