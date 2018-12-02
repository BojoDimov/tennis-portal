import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class EditionsDesktopView extends React.Component {
  render() {
    const { editions } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Лига</TableCell>
            <TableCell>Турнир</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editions.map(edition => {
            return (
              <TableRow key={edition.id}>
                <TableCell>{edition.tournament.name}</TableCell>
                <TableCell>{edition.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default EditionsDesktopView;