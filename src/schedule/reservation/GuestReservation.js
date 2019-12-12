import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import * as ReservationStyles from './styles';
import { ReservationType } from '../../enums';
import { dispatchEvent } from '../../services/events.service';

class GuestReservation extends React.Component {
  render() {
    const { reservation, available, classes } = this.props;
    let type = classes.free;
    if (reservation.id)
      type = classes.taken;

    if (!available || reservation.type == ReservationType.SERVICE)
      type = classes.unavaliable;

    return (
      <TableCell padding="none" className={type} onClick={() => this.promptLogin()}></TableCell>
    );
  }

  promptLogin() {
    if (this.props.available)
      dispatchEvent('menu-login');
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
  },
  unavaliable: {
    ...ReservationStyles.cell,
    background: 'url(assets/empty.png)',
    '&:hover': {
      cursor: 'not-allowed'
    }
  }
});

export default withStyles(styles)(GuestReservation);