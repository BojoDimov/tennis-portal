import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import * as ReservationStyles from './styles';
import { l10n_text } from '../../components/L10n';
import { ReservationType } from '../../enums';

class ShuffleItem extends React.Component {

  select() {
    const { reservation, shuffle, onSelect, onUnselect } = this.props;
    const index = this.findIndex(reservation, shuffle);

    if (index != -1)
      onUnselect(index);
    else onSelect(reservation);
  }

  findIndex(reservation, shuffle) {
    return shuffle.findIndex(e => e.date == reservation.date && e.hour == reservation.hour && e.courtId == reservation.courtId);
  }

  render() {
    const { reservation, shuffle, classes } = this.props;
    const available = reservation.hour <= reservation.court.workingHoursEnd - 1
      && reservation.hour >= reservation.court.workingHoursStart;

    if (!available)
      return <TableCell padding="none" className={classes.unavaliable}></TableCell>;

    let type = classes.free;

    if (this.findIndex(reservation, shuffle) != -1)
      type = classes.selected;

    if (!reservation.id)
      return (
        <TableCell padding="none" className={type} onClick={() => this.select()}>
        </TableCell>
      );

    if (type == classes.free)
      type = classes.taken

    if (reservation.type == ReservationType.USER || reservation.type == ReservationType.SUBSCRIPTION)
      return (
        <TableCell padding="none" className={type} onClick={() => this.select()}>
          {type != classes.free && <span>{reservation.customer.name}</span>}
        </TableCell>
      );

    return (
      <TableCell padding="none" className={type} onClick={() => this.select()}>
        {type != classes.free
          && <span>{l10n_text(reservation.type, ReservationType, "ReservationType")}</span>}
      </TableCell>
    );
  }
}


const styles = (theme) => ({
  free: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
  },
  taken: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
  unavaliable: {
    ...ReservationStyles.cell,
    background: 'url(assets/empty.png)',
    '&:hover': {
      cursor: 'not-allowed'
    }
  },
  service: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    color: theme.palette.secondary.main,
    fontWeight: '700',
    background: 'url(assets/empty.png)'
  },
  selected: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
});

export default withStyles(styles)(ShuffleItem);