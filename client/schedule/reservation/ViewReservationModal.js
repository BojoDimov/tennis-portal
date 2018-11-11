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


class ViewReservationModal extends React.Component {
  makeReservation() {
    return QueryService
      .post(`/schedule/reservations`, this.props.reservation)
      .then(_ => this.props.onAction())
      .catch(err => console.log('Found some ERRORS:', err));
  }

  cancelReservation() {
    return QueryService
      .delete(`/schedule/reservations/${this.props.reservation.id}/cancel`)
      .then(_ => this.props.onAction())
      .catch(err => console.log('Found some ERRORS:', err));
  }

  render() {
    const { reservation, isOpen, onClose } = this.props;

    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>
          <DialogContentText variant="headline">
            Резервация на
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
          {!reservation.id && <Typography variant="caption">
            Поради възможността от възникване на премествания, запазването на
            корт не ви гарантира на 100%, че ще играете точно на този корт.
          </Typography>}
          {reservation.id && <Typography variant="caption">
            Имате право да откажете резервацията до 8 часа преди уреченият час.
            След това системата отчита вашият час като използван и трябва да го заплатите.
            Ако имате абонамент, часът ще ви се брои като отигран.
          </Typography>}
        </DialogContent>

        {!reservation.id && <DialogActions>
          <Button variant="contained" color="primary" onClick={() => this.makeReservation()}>
            Резервиране
          </Button>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>}

        {reservation.id && <DialogActions>
          <Button variant="outlined" color="secondary" onClick={() => this.cancelReservation()}>
            Отмяна на резервацията
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>}
      </Dialog>
    );
  }
}

export default ViewReservationModal;