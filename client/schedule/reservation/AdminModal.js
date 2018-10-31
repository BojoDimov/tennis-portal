import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

import QueryService from '../../services/query.service';
import EnumSelect from '../../components/EnumSelect';
import { ReservationPayment, ReservationType } from '../../enums';
import { getHour } from '../../utils';

class AdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservation: {
        court: {},
        type: '',
        payments: []
      }
    }

    this.handleChange = (prop) => (e) => {
      this.state.reservation[prop] = e.target.value;
      this.setState({ reservation: this.state.reservation });
    }

    this.handlePaymentChange = (prop, index) => (e) => {
      this.state.reservation.payments[index][prop] = e.target.value;
      this.setState({ reservation: this.state.reservation });
    }
  }

  componentDidMount() {
    this.setState({ reservation: this.props.reservation });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservation != this.props.reservation)
      this.setState({ reservation: this.props.reservation });
  }

  action() {
    if (this.state.reservation.id)
      return QueryService
        .post(`/schedule/reservations/${this.state.reservation.id}`, this.state.reservation)
        .then(_ => this.props.onAction())
        .catch(err => console.log('Found some ERRORS:', err));
    else
      return QueryService
        .post(`/schedule/reservations`, this.state.reservation)
        .then(_ => this.props.onAction())
        .catch(err => console.log('Found some ERRORS:', err));
  }

  remove() {
    return QueryService
      .delete(`/schedule/reservations/${this.state.reservation.id}`)
      .then(_ => this.props.onAction())
      .catch(err => console.log('Found some ERRORS:', err));
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { reservation } = this.state;

    return (
      <Dialog open={isOpen} onClose={onClose} fullWidth={true}>
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
          {reservation.user && <Typography variant="caption">
            Резервирал:
            <Typography style={{ display: 'flex' }}>
              {reservation.user.name}
              {reservation.user.isAdmin && <Typography style={{ marginLeft: '.5rem' }} variant="caption">(Администратор)</Typography>}
            </Typography>
          </Typography>}

          <EnumSelect
            label="Вид резервация:"
            value={reservation.type}
            fullWidth={false}
            onChange={this.handleChange('type')}
            EnumValues={ReservationType}
            EnumName="ReservationType" />

          <Typography variant="subheading" style={{ marginTop: '1rem', alignItems: 'center', display: 'flex' }}>
            Плащания
            <span
              style={{ cursor: 'pointer', margin: '.5rem 0 0' }}
              onClick={() => {
                reservation.payments.push({ type: "", amount: "", reservationId: reservation.id });
                this.setState({ reservation: reservation });
              }}
            >
              <AddIcon color="primary" />
            </span>
          </Typography>

          {reservation.payments && reservation.payments.map((payment, index) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }} key={index}>
                <EnumSelect
                  style={{ width: '100px' }}
                  label="Вид плащане"
                  value={payment.type}
                  onChange={this.handlePaymentChange('type', index)}
                  EnumValues={ReservationPayment}
                  EnumName="ReservationPayment" />

                <TextField
                  style={{ marginLeft: '1rem', marginRight: '1rem' }}
                  label="Стойност"
                  value={payment.amount}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Лв</InputAdornment>
                  }}
                  onChange={this.handlePaymentChange('amount', index)}
                />
                <span style={{ cursor: 'pointer' }} onClick={() => {
                  this.state.reservation.payments.splice(index, 1);
                  this.setState({ reservation: this.state.reservation });
                }}>
                  <ClearIcon style={{ color: 'darkred' }} />
                </span>
              </div>
            );
          })}

          {reservation.payments.length == 0 && <Typography variant="caption">Няма регистрирани плащания</Typography>}

          <TextField
            label="Бележка"
            value={reservation.info}
            fullWidth={true}
            multiline={true}
            margin="none"
            onChange={this.handleChange('info')}
          />

        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.action()}
          >
            Запазване
          </Button>
          {this.state.reservation.id && <Button
            variant="contained"
            color="secondary"
            onClick={() => this.remove()}
          >
            Изтриване
          </Button>}
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
          >
            Отказ
          </Button>
        </DialogActions>
      </Dialog >
    );
  }
}

export default AdminModal;