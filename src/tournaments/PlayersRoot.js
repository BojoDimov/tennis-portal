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
                let prefix = 'basic';
                if (team.globalRank === 1)
                  prefix = 'gold'
                else if (team.globalRank === 2)
                  prefix = 'silver'
                else if (team.globalRank === 3)
                  prefix = 'bronze'

                return (
                  <React.Fragment key={team.id}>
                    <ListItem style={{ display: 'flex' }}>
                      <div style={{ flexBasis: '34%', display: 'flex' }}>
                        <div className={classes.badge + ' ' + classes[prefix + 'Badge']}>
                          <Typography className={classes[prefix + 'Typography']}>#{team.globalRank}</Typography>
                        </div>
                      </div>
                      <div style={{ flexBasis: '66%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', width: '100%' }}>
                          <div style={{ flexBasis: '85%', display: 'flex', alignItems: 'center' }}>
                            <Typography>{team.user1.name}</Typography>
                            {team.user2 && <Typography>{team.user2.name}</Typography>}
                          </div>
                          <div style={{ flexBasis: '15%' }}>
                            <IconButton color="primary" onClick={() => this.setState({ editTeamModel: team })} >
                              <EditIcon />
                            </IconButton>
                          </div>
                        </div>
                        <div style={{ width: '100%' }}>
                          <Typography variant="caption">
                            <span>Мачове: {team.wonMatches}/{team.totalMatches}</span>
                            <span style={{ marginLeft: '.3em' }}>({team.totalMatches != 0 ? team.wonMatches / team.totalMatches : 0}% win ratio)</span>
                          </Typography>
                          <Typography variant="caption">
                            <span>Турнири: {team.wonTournaments}/{team.totalTournaments}</span>
                            <span style={{ marginLeft: '.3em' }}>({team.totalTournaments != 0 ? team.wonTournaments / team.totalTournaments : 0}% win ratio)</span>
                          </Typography>
                        </div>
                      </div>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                  // <div key={team.id}>
                  //   <ListItem style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  //     <div className={classes[prefix + 'Root']} style={{ borderRadius: '50%', border: '1px solid lightgray', flexBasis: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  //       <Typography className={classes[prefix + 'Typography']}>#{team.globalRank}</Typography>
                  //     </div>
                  //     <div style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  //       <Typography>{team.user1.name}</Typography>
                  //       <Typography>Турнири: {team.wonMatches} / {team.totalMatches} ({team.totalMatches != 0 ? team.wonMatches / team.totalMatches : 0}% win ratio)</Typography>
                  //       <Typography>Турнири: {team.wonTournaments} / {team.totalTournaments} ({team.totalTournaments != 0 ? team.wonTournaments / team.totalTournaments : 0}% win ratio)</Typography>
                  //       { <IconButton color="primary" onClick={() => this.setState({ editTeamModel: team })}>
                  //         <EditIcon />
                  //       </IconButton> }
                  //     </div>
                  //   </ListItem>
                  //   <Divider />
                  // </div>
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
  badge: {
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  basicBadge: {
    border: '1px solid lightgray'
  },
  goldBadge: {
    backgroundColor: '#FFD200',
    backgroundImage: 'linear-gradient(15deg, #FFD200 0%, #F7971E 74%);'
  },
  silverBadge: {
    backgroundColor: '#b8c6db',
    backgroundImage: 'linear-gradient(315deg, #8ba2c3 0%, #f5f7fa 74%)'
  },
  bronzeBadge: {
    backgroundColor: '#772f1a',
    backgroundImage: 'linear-gradient(315deg, #772f1a 0%, #f2a65a 74%)'
  },
  goldRoot: {
    backgroundColor: '#FFD200',
    backgroundImage: 'linear-gradient(15deg, #FFD200 0%, #F7971E 74%);',
    border: 'none'
  },
  goldTypography: {
    fontWeight: 700,
    color: 'white'
  },
  silverRoot: {
    backgroundColor: '#b8c6db',
    backgroundImage: 'linear-gradient(315deg, #8ba2c3 0%, #f5f7fa 74%)',
    border: 'none'
  },
  silverTypography: {
    fontWeight: 700
  },
  bronzeRoot: {
    backgroundColor: '#772f1a',
    backgroundImage: 'linear-gradient(315deg, #772f1a 0%, #f2a65a 74%)',
    border: 'none'
  },
  bronzeTypography: {
    fontWeight: 700,
    color: 'whitesmoke'
  }
});

export default withStyles(styles)(PlayersRoot);