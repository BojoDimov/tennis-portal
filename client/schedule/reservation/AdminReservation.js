import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import EditReservationModal from './EditReservationModal';
import * as ReservationStyles from './styles';
import L10n from '../../components/L10n';

class AdminReservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    }
  }

  render() {
    const { reservation, onChange, classes } = this.props;
    let type = classes.free;
    if (reservation.id)
      type = classes.reserved;

    return (
      <React.Fragment>
        <TableCell
          padding="none"
          className={type}
          onClick={() => this.setState({ modal: true })}
        >
          {reservation.customer && <span>{reservation.customer.name}</span>}
          {!reservation.customer && <L10n type="ReservationType">{reservation.type}</L10n>}
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
    ...ReservationStyles.button,
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
  },
  reserved: {
    ...ReservationStyles.cell,
    ...ReservationStyles.button,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  }
});

export default withStyles(styles)(AdminReservation);