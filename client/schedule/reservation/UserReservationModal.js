import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import QueryService from '../../services/query.service';
import { ReservationType, ApplicationMode } from '../../enums';
import { getHour } from '../../utils';

class UserReservationModal extends React.Component {
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
    const model = this.state.reservation;
    if (this.props.mode == ApplicationMode.GUEST)
      model.type = ReservationType.GUEST;
    else
      model.type = ReservationType.USER;

    return QueryService
      .post(`/schedule/reservations`, model)
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
          <Typography variant="caption">
            Поради възможността от възникване на премествания, запазването на
            корт не ви гарантира на 100%, че ще играете точно на този корт.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => this.action()}>
            Резервиране
          </Button>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default UserReservationModal;