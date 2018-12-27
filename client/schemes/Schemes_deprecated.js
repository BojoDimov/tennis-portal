import React from 'react';
import { Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import QueryService from '../services/query.service';
import UserService from '../services/user.service';

class Schemes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schemes: [
        { id: 1, name: 'Сингъл мъже' },
        { id: 2, name: 'Сингъл мъже 45+' },
        { id: 3, name: 'Двойки мъже' },
        { id: 4, name: 'Двойки жени' },
        { id: 5, name: 'Двойки микс' },
      ],
      canDelete: UserService.isAdmin()
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {

    const { editionId } = this.props;

    return QueryService
      .get(`/schemes?editionId=${editionId}`)
      .then(e => this.setState({ schemes: e }));
  }

  handleDelete(scheme) {
    return QueryService
      .delete(`/schemes/${scheme.id}`)
      .then(e => this.getData());
  }

  render() {
    const { schemes, canDelete } = this.state;

    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <Hidden smDown>
                <TableCell>Дата</TableCell>
                {canDelete && <TableCell></TableCell>}
              </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {schemes.map(scheme => {
              return (
                <TableRow key={scheme.id}>
                  <TableCell>
                    <Link to={`/schemes/${scheme.id}`}>
                      <Typography variant="body2">{scheme.name}</Typography>
                    </Link>
                  </TableCell>

                  <Hidden smDown>
                    <TableCell>
                      <Typography>{new Date(scheme.date).toLocaleDateString()}</Typography>
                    </TableCell>
                    {canDelete && <TableCell>
                      <Button variant="text" color="primary" size="small"
                        style={{ color: 'darkred' }}
                        onClick={() => this.handleDelete(scheme)}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>}
                  </Hidden>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default Schemes;