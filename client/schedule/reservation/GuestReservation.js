import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import * as ReservationStyles from './styles';

class GuestReservation extends React.Component {
  render() {
    const { reservation, classes } = this.props;
    let type = classes.free;
    if (reservation.id)
      type = classes.taken;

    return (
      <TableCell padding="none" className={type}></TableCell>
    );
  }
}

const styles = (theme) => ({
  free: {
    ...ReservationStyles.cell,
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
  },
  taken: {
    ...ReservationStyles.cell,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  }
});

export default withStyles(styles)(GuestReservation);