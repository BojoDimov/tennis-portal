import React from 'react';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'material-ui-pickers/DatePicker';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  names: {
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row'
    }
  }
});

class MatchDetailsEdit extends React.Component {
  render() {
    const { classes, match } = this.props;

    return (
      <React.Fragment>
        <div>
          <TextField label="Отбор 1" fullWidth={true} style={{ marginRight: '1rem' }} />
          <TextField label="Отбор 2" fullWidth={true} style={{ marginRight: '1rem' }} />
          <TextField label="Отказал се" fullWidth={true} style={{ marginRight: '1rem' }} />
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">Сет №</TableCell>
              <TableCell padding="none">Отбор 1</TableCell>
              <TableCell padding="none">Отбор 2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map(index => {
              return (
                <TableRow key={index}>
                  <TableCell padding="dense">{index}</TableCell>
                  <TableCell padding="none">
                    <input type="text" style={{ maxWidth: '40px' }} />
                  </TableCell>
                  <TableCell padding="none">
                    <input type="text" style={{ maxWidth: '40px' }} />
                  </TableCell>
                </TableRow>
              );
            })}

            {/* <TableRow>
              <TableCell padding="none">
                <TextField label="Отбор 2" />
              </TableCell>
              <TableCell padding="none" numeric={true}>
                <TextField type="numeric" />
              </TableCell>
              <TableCell padding="none" numeric={true}>II</TableCell>
              <TableCell padding="none" numeric={true}>III</TableCell>
              <TableCell padding="none" numeric={true}>IV</TableCell>
              <TableCell padding="none" numeric={true}>V</TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MatchDetailsEdit);