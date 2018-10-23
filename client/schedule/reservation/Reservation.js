import React from 'react';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AdminModal from './AdminModal';
import UserReservationModal from './UserReservationModal';
import UserCancelReservationModal from './UserCancelReservationModal';
import { ApplicationMode } from '../../enums';
import userService from '../../services/user.service';

const styles = (theme) => ({
  free: {
    backgroundColor: '#fff',
    border: '1px solid lightgrey',
    '&:hover': {
      opacity: .8,
      cursor: 'pointer'
    },
    color: theme.palette.primary.main,
    width: '50px'
  },
  reserved: {
    backgroundColor: theme.palette.primary.light,
    border: '1px solid lightgrey',
    '&:hover': {
      opacity: .8,
      cursor: 'pointer'
    },
    color: theme.palette.primary.contrastText,
    width: '50px'
  },
  taken: {
    backgroundColor: theme.palette.secondary.light,
    border: '1px solid lightgrey',
    '&:hover': {
      cursor: 'not-allowed'
    },
    color: theme.palette.secondary.contrastText,
    width: '50px'
  },
  editable: {
    backgroundColor: theme.palette.secondary.light,
    border: '1px solid lightgrey',
    '&:hover': {
      opacity: .8,
      cursor: 'pointer'
    },
    color: theme.palette.secondary.contrastText,
    width: '50px'
  },
  unavaliable: {
    background: 'url(assets/empty.png)',
    width: '50px',
    '&:hover': {
      cursor: 'not-allowed'
    }
  }
});

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      userId: (userService.getUser() || { id: null }).id
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mode != this.props.mode)
      this.setState({ userId: (userService.getUser() || { id: null }).id });
  }

  render() {
    const { reservation, onChange, classes, mode } = this.props;
    const { isOpen, userId } = this.state;
    let type = classes.taken;
    let Dialog = null;

    if (!reservation.id) {
      type = classes.free;
      Dialog = UserReservationModal;
    }

    if (userId != null && reservation.userId == userId) {
      type = classes.reserved;
      Dialog = UserCancelReservationModal;
    }

    if (mode == ApplicationMode.ADMIN) {
      Dialog = AdminModal;
      if (type == classes.taken || type == classes.reserved)
        type = classes.editable;
    }

    if (reservation.court.workingHoursStart > reservation.hour
      || reservation.court.workingHoursEnd < reservation.hour + 1) {
      type = classes.unavaliable;
      Dialog = null;
    }

    return (
      <React.Fragment>
        <TableCell
          padding="none"
          className={type}
          onClick={() => this.setState({ isOpen: true })}
        >
        </TableCell>

        {Dialog && <Dialog
          mode={mode}
          reservation={reservation}
          isOpen={isOpen}
          onAction={(e) => {
            onChange(e);
            this.setState({ isOpen: false });
          }}
          onClose={() => this.setState({ isOpen: false })}
        />}

      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Reservation);