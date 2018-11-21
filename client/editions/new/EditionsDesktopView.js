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
            <TableCell>waddup</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>konichiwa</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default EditionsDesktopView;