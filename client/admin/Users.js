import React from 'react';
import { Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';
import BuildIcon from '@material-ui/icons/Build';
import Paper from '@material-ui/core/Paper';

import EditUser from './EditUser';
import QueryService from '../services/query.service';
import UserModel from '../users/user.model';


class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersFilter: '',
      page: 0,
      rowsPerPage: 5,
      editUser: null
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
      <div style={{ margin: '1rem', display: 'flex', flexDirection: 'column' }}>
        <Paper style={{ margin: '1rem 0', padding: '1rem', backgroundColor: 'whitesmoke' }}>
          <Typography variant="headline">Потребители</Typography>
          <div style={{ width: '320px' }}>
            <Button variant="contained" color="primary" size="small" onClick={() => this.setState({ editUser: UserModel.get() })}>
              Нов потребител
          </Button>
          </div>

          {editUser && <EditUser user={editUser} onSave={() => this.getData()} onCancel={() => this.setState({ editUser: null })} />}

          <div style={{ marginBottom: '1rem', width: '320px' }}>
            <TextField
              label="Търсене по име"
              value={usersFilter}
              fullWidth={true}
              onChange={(e) => this.setState({ usersFilter: e.target.value })}
            />
          </div>
        </Paper>


        <Table style={{ backgroundColor: 'whitesmoke' }}>
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell>Създаден</TableCell>
              <TableCell padding="none">Активен</TableCell>
              <TableCell padding="none">Администратор</TableCell>
              <TableCell padding="none"></TableCell>
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
                  <TableCell padding="none">{user.isActive && <DoneIcon color="action" />}</TableCell>
                  <TableCell padding="none">{user.isAdmin && <DoneIcon color="action" />}</TableCell>
                  <TableCell padding="none">
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => this.setState({ editUser: this.prepareForEdit(user) })}
                    >
                      <BuildIcon />
                    </Button>

                    <Button
                      variant="text"
                      color="secondary"
                      size="small"
                      onClick={() => this.remove(index)}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Users;