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

class PlayersRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      teamsMode: 'single',
      page: 0,
      itemsPerPage: 25,
      totalCount: 100,
      searchTerm: ''
    }
  }
  render() {
    const { teams, totalCount, page, itemsPerPage, searchTerm, teamsMode } = this.state;

    return (
      <div className="container">
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="headline" color="primary">Вечна класация на играчите</Typography>


          <TextField
            label="Търсене по име"
            fullWidth
            value={searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value })}
          />

          <Tabs
            value={teamsMode}
            onChange={(_, e) => this.setState({ teamsMode: e })}
            textColor="primary"
            variant="fullWidth">
            <Tab value="single" label="Сингъл"></Tab>
            <Tab value="double" label="Двойки"></Tab>
          </Tabs>

          <Hidden smDown>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Име</TableCell>
                  <TableCell>Мачове</TableCell>
                  <TableCell>Спечелени мачове</TableCell>
                  <TableCell>Турнири</TableCell>
                  <TableCell>Спечелени турнири</TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                {teams.map(team => {
                  return (
                    <TableRow>
                      <TableCell>Име Фамилия</TableCell>
                      <TableCell>50</TableCell>
                      <TableCell>35</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>5</TableCell>
                    </TableRow>);
                })}
              </TableBody>
            </Table>
          </Hidden>

          <Hidden smUp>
            <List>
              {teams.map(team => {
                return (
                  <React.Fragment>
                    <ListItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2">Име Фамилия</Typography>
                      <Typography variant="caption">Турнири: 58 / 400 (14.5% win ratio)</Typography>
                      <Typography variant="caption">Мачове: 58 / 400 (14.5% win ratio)</Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
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
            onChangePage={(e, page) => this.setState({ page })}
            onChangeRowsPerPage={e => this.setState({ itemsPerPage: e.target.value, page: 0 })}
          />
        </Paper>
      </div>
    )
  }
}

export default PlayersRoot;