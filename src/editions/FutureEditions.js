import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

class FutureEditions extends React.Component {
  render() {
    const { editions, canDelete, onDelete } = this.props;

    if (editions.length == 0)
      return <i>няма предстоящи турнири</i>

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Лига</TableCell>
            <TableCell>Турнир</TableCell>
            <TableCell>Дата</TableCell>
            {canDelete && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {editions.map(edition => {
            return (
              <TableRow key={edition.id}>
                <TableCell>
                  {edition.tournament.name}
                </TableCell>
                <TableCell>{edition.name}</TableCell>
                <TableCell>baba qga</TableCell>
                {canDelete && <TableCell>
                  <Button variant="text" color="primary" size="small"
                    style={{ color: 'darkred' }}
                    onClick={() => onDelete(edition.id)}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

FutureEditions.propTypes = {
  editions: PropTypes.array.isRequired
};

export default FutureEditions;