import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';
import { getHour } from '../../utils';


class ViewReservationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    }
  }
  makeReservation() {
    return QueryService
      .post(`/schedule/reservations`, this.props.reservation)
      .then(_ => this.props.onAction())
      .catch(err => this.setState({ errors: err }));
  }

  cancelReservation() {
    return QueryService
      .delete(`/schedule/reservations/${this.props.reservation.id}/cancel`)
      .then(_ => this.props.onAction())
      .catch(err => this.setState({ errors: err }));
  }

  render() {
    const { reservation, isOpen, onClose, classes } = this.props;

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
            Имате право да откажете часът до 4 часа (8 часа за абонамент) преди неговото начало.
            След това системата отчита вашият час като използван.
            Ако имате абонамент, часът ще ви се брои като използван.
          </Typography>}

          {this.state.errors && this.state.errors.length > 0
            && <div style={{ margin: '1rem 0', color: 'red' }}>
              {this.state.errors.map((err, index) => {
                return (
                  <div key={index}><em>{index + 1}. {ErrorTexts[err]}</em></div>
                );
              })}
            </div>}
        </DialogContent>

        {!reservation.id && <DialogActions className={classes.btnContainer}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.makeReservation()}>
            Резервиране
          </Button>
          <Button variant="outlined" color="primary" className={classes.btn} onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>}

        {reservation.id && <DialogActions className={classes.btnContainer}>
          <Button variant="outlined" color="secondary" className={classes.btn} onClick={() => this.cancelReservation()}>
            Отмяна на резервацията
          </Button>
          <Button variant="contained" color="secondary" className={classes.btn} onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>}
      </Dialog>
    );
  }
}

const ErrorTexts = {
  'exist': 'Резервация за този ден, час и корт вече съществува.',
  'maxAllowedTimeDiff': 'Резервацията не може да бъде отказана, защото остават по-малко часове от минимално допустимите часове за отказ.',
  'reservationInThePast': 'Часът за тази резервация вече е минал.'
};

const styles = (theme) => ({
  btnContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '.3rem',
      width: '100%'
    }
  }
});

export default withStyles(styles)(ViewReservationModal);