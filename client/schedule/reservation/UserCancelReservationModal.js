import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import QueryService from '../../services/query.service';
import { getHour } from '../../utils';

class UserCancelReservationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservation: {
        court: {}
      }
    };
  }

  componentDidMount() {
    this.setState({ reservation: this.props.reservation });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservation != this.props.reservation)
      this.setState({ reservation: this.props.reservation });
  }

  action() {
    return QueryService
      .delete(`/schedule/reservations/${this.state.reservation.id}/cancel`)
      .then(_ => this.props.onAction())
      .catch(err => console.log('Found some ERRORS:', err));
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { reservation } = this.state;

    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>
          <DialogContentText variant="headline">
            Отказване на резервация за
            <span style={{ marginLeft: '.5rem' }}>
              {reservation.court.name}
            </span>
          </DialogContentText>
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption">
            Час:
            <Typography>{getHour(reservation.hour)} - {getHour(reservation.hour + 1)}</Typography>
          </Typography>
          {reservation.info && <Typography variant="caption">
            Бележка:
            <Typography>{reservation.info}</Typography>
          </Typography>}
          <Typography variant="caption" style={{ marginTop: '.5rem' }}>
            Имате право да откажете резервацията до 8 часа преди уреченият час.
            След това системата отчита вашият час като използван и трябва да го заплатите.
            Ако имате абонамент, часът ще ви се брои като отигран.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={() => this.action()}>
            Да
          </Button>
          <Button variant="contained" color="primary" onClick={onClose} >
            Не
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default UserCancelReservationModal;