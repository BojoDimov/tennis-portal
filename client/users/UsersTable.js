import React from 'react';
import { Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DoneIcon from '@material-ui/icons/Done';

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5
    }
  }

  render() {
    const { users, onDelete } = this.props;

    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <Hidden smDown>
                <TableCell>Създаден</TableCell>
                <TableCell>Активен</TableCell>
                <TableCell>Администратор</TableCell>
                <TableCell></TableCell>
              </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => {
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

                  <Hidden smDown>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{user.isActive && <DoneIcon color="action" />}</TableCell>
                    <TableCell>{user.isAdmin && <DoneIcon color="action" />}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        style={{ color: 'darkred' }}
                        onClick={() => onDelete(user.id)}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>
                  </Hidden>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </React.Fragment >
    );
  }
}

export default UsersTable;

