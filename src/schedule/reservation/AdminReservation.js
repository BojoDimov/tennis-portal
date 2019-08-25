import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import EditReservationModal from './EditReservationModal';
import * as ReservationStyles from './styles';
import { ReservationType } from '../../enums';
import L10n from '../../components/L10n';

class AdminReservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    }
  }

  getCellLabel(reservation) {
    if (reservation.type == ReservationType.COMPETITOR)
      return (<L10n translate="ReservationType">{ReservationType.COMPETITOR}</L10n>);
    else if (reservation.type == ReservationType.USER && reservation.customer)
      return (<span>{reservation.customer.name}</span>);
    else
      return (<L10n translate="ReservationType">{reservation.type}</L10n>);
  }

  render() {
    const { reservation, onChange, classes } = this.props;
    let type = classes.free;
    if (reservation.id) {
      if ((reservation.type != ReservationType.GUEST || reservation.payments.length > 0)
        && (reservation.type != ReservationType.USER || reservation.payments.length > 0))
        type = classes.paidReservation;
      else
        type = classes.unpaidReservation;
    }

    if (reservation.type == ReservationType.SERVICE)
      type = classes.unavaliable;

    return (
      <React.Fragment>
        <TableCell
          padding="none"
          className={type}
          onClick={() => this.setState({ modal: true })}
        >
          {this.getCellLabel(reservation)}
        </TableCell>

        <EditReservationModal
          reservation={reservation}
          isOpen={this.state.modal}
          onAction={(e) => {
            onChange(e);
            this.setState({ modal: false });
          }}
          onClose={() => this.setState({ modal: false })}
        />

      </React.Fragment>
    );
  }
}

const styles = (theme) => ({
  free: {
    ...ReservationStyles.cell,
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: '#F3FBF0',
      cursor: 'pointer',
    }
  },
  unpaidReservation: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
  paidReservation: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  },
  unavaliable: {
    ...ReservationStyles.cell,
    cursor: 'pointer',
    color: theme.palette.secondary.main,
    fontWeight: '700',
    background: 'url(assets/empty.png)'
  }
});

export default withStyles(styles)(AdminReservation);