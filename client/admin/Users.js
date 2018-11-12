import React from 'react';
import { Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DoneIcon from '@material-ui/icons/Done';
import BuildIcon from '@material-ui/icons/Build';
import Paper from '@material-ui/core/Paper';

import QueryService from '../services/query.service';
import UserModel from '../users/user.model';
import UserDetailsModal from './UserDetailsModal';
import UserSubscriptionsModal from './UserSubscriptionsModal';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersFilter: '',
      page: 0,
      rowsPerPage: 5,
      editUser: null,
      subsUser: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService
      .get('/users')
      .then(e => this.setState({ users: e }));
  }

  filterUsers() {
    if (this.state.usersFilter.length > 0)
      return this.state.users.filter(e => e.name.indexOf(this.state.usersFilter) != -1);
    else return this.state.users;
  }

  prepareForEdit(user) {
    const names = user.name.split(' ');
    user.firstName = names[0];
    user.lastName = names[1];
    user.startedPlaying = parseInt(user.startedPlaying) || '';
    return user;
  }

  remove(index) {
    const users = this.state.users;

    return QueryService
      .delete(`/users/${users[index].id}`)
      .then(_ => {
        users.splice(index, 1);
        this.setState({ users });
      })
      .catch(err => null);
  }

  render() {
    const { usersFilter, editUser, editUserErrors } = this.state;
    const users = this.filterUsers(usersFilter);

    return (
      <div className="container">
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="headline">Потребители</Typography>
          <Button variant="contained" color="primary" size="small" onClick={() => this.setState({ editUser: UserModel.get() })}>
            Нов потребител
          </Button>
          <TextField
            label="Търсене по име"
            value={usersFilter}
            fullWidth={true}
            onChange={(e) => this.setState({ usersFilter: e.target.value })}
          />

          <UserDetailsModal
            user={this.state.editUser}
            isOpen={this.state.editUser != null}
            onClose={() => this.setState({ editUser: null })}
          />

          <UserSubscriptionsModal
            user={this.state.subsUser}
            isOpen={this.state.subsUser != null}
            onClose={() => this.setState({ subsUser: null })}
          />

          <Hidden xsDown>
            <Table padding="none">
              <TableHead>
                <TableRow>
                  <TableCell>Име</TableCell>
                  <TableCell>Създаден</TableCell>
                  <TableCell>Активен</TableCell>
                  <TableCell>Администратор</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Link to={`/users/${user.id}`}>
                          <Typography variant="body2">{user.name}</Typography>
                        </Link>
                        <Typography style={{ fontStyle: 'italic' }}>
                          {user.email}
                        </Typography>
                      </TableCell>

                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{user.isActive && <DoneIcon color="action" />}</TableCell>
                      <TableCell>{user.isAdmin && <DoneIcon color="action" />}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => this.setState({ editUser: this.prepareForEdit(user) })}>
                          <BuildIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => this.setState({ subsUser: user })}>
                          <DescriptionOutlinedIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => this.remove(index)}>
                          <DeleteForeverIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Hidden>

          <Hidden mdUp>
            <List>
              {users.map((user, index) => {
                return (
                  <React.Fragment>
                    <ListItem style={{ padding: '0', justifyContent: 'space-between' }}>
                      <div>
                        <Link to={`/users/${user.id}`}>
                          <Typography variant="body2">{user.name}</Typography>
                        </Link>
                        <Typography style={{ fontStyle: 'italic' }}>
                          {user.email}
                        </Typography>
                      </div>

                      <div>
                        <IconButton color="primary" onClick={() => this.setState({ editUser: this.prepareForEdit(user) })}>
                          <BuildIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => this.setState({ subsUser: user })}>
                          <DescriptionOutlinedIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => this.remove(index)}>
                          <DeleteForeverIcon />
                        </IconButton>
                      </div>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          </Hidden>

        </Paper>
      </div>
    );
  }
}

export default Users;