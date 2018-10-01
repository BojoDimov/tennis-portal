import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

class PreviousEditions extends React.Component {
  render() {
    const { editions, canDelete, onDelete } = this.props;

    if (editions.length == 0)
      return <i>няма минали турнири</i>

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Лига</TableCell>
            <TableCell>Турнир</TableCell>
            <Hidden smDown>
              <TableCell>Дата</TableCell>
              {canDelete && <TableCell></TableCell>}
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {editions.map(edition => {
            return (
              <TableRow key={edition.id}>
                <TableCell>
                  <Link to={`/tournaments/${edition.tournament.id}`}>
                    <Typography variant="body2">{edition.tournament.name}</Typography>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/editions/${edition.id}`}>
                    <Typography variant="body2">{edition.name}</Typography>
                  </Link>
                </TableCell>

                <Hidden smDown>
                  <TableCell>
                    {new Date(edition.startDate).toLocaleDateString()}
                  </TableCell>
                  {canDelete && <TableCell>
                    <Button variant="text" color="primary" size="small"
                      style={{ color: 'darkred' }}
                      onClick={() => onDelete(edition.id)}
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
    );
  }
}

PreviousEditions.propTypes = {
  editions: PropTypes.array.isRequired
};

export default PreviousEditions;