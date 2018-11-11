import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import ViewReservationModal from './ViewReservationModal';
import * as ReservationStyles from './styles';

class UserReservation extends React.Component {
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
          {reservation.id && <span>{reservation.type}</span>}
        </TableCell>

        <ViewReservationModal
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
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  }
});

export default withStyles(styles)(UserReservation);