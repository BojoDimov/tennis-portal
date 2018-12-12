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
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import QueryService from '../../services/query.service';
import EnumSelect from '../../components/EnumSelect';
import AsyncSelect from '../../components/select/AsyncSelect';
import { ReservationPayment, ReservationType } from '../../enums';
import { l10n_text } from '../../components/L10n';
import { getHour } from '../../utils';

class EditReservationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservation: {
        court: {},
        type: '',
        season: {},
        payments: [],
        administrator: {},
        customer: {}
      },
      errors: []
    }

    this.handleChange = (prop) => (e) => {
      const reservation = this.state.reservation;
      reservation[prop] = e.target.value;
      if (prop == 'type') {
        reservation.customer = null;
        reservation.customerId = null;
        reservation.subscription = null;
        reservation.subscriptionId = null;
      }

      this.setState({ reservation });
    };

    this.handleCustomChange = (prop) => (value) => {
      const reservation = this.state.reservation;

      if (prop == 'customer') {
        reservation.customer = null;
        reservation.customerId = (value || { id: null }).id;
        reservation.subscription = null;
        reservation.subscriptionId = null;
      }

      if (prop == 'subscription') {
        reservation.subscription = null;
        reservation.subscriptionId = (value || { id: null }).id;
      }

      reservation[prop] = value;

      this.setState({ reservation });
    };

    this.handlePaymentChange = (prop, index) => (e) => {
      this.state.reservation.payments[index][prop] = e.target.value;
      this.setState({ reservation: this.state.reservation });
    };

    this.handlePaymentSubscriptionChange = (index) => (value) => {
      this.state.reservation.payments[index].subscription = value;
      if (value)
        this.state.reservation.payments[index].subscriptionId = value.id;
      else
        this.state.reservation.payments[index].subscriptionId = null;
      this.setState({ reservation: this.state.reservation });
    };
  }

  componentDidMount() {
    const { reservation } = this.props;
    this.setState({ reservation: JSON.parse(JSON.stringify(reservation)), errors: [] });
  }

  componentDidUpdate(prevProps) {
    const { reservation } = this.props;
    if (prevProps.reservation != reservation)
      this.setState({ reservation: JSON.parse(JSON.stringify(reservation)), errors: [] });
  }

  action() {
    if (this.state.reservation.id)
      return QueryService
        .post(`/schedule/reservations/${this.state.reservation.id}`, this.state.reservation)
        .then(_ => {
          this.setState({ errors: [] });
          this.props.onAction()
        })
        .catch(err => this.setState({ errors: err }));
    else
      return QueryService
        .post(`/schedule/reservations`, this.state.reservation)
        .then(_ => {
          this.setState({ errors: [] });
          this.props.onAction()
        })
        .catch(err => this.setState({ errors: err }));
  }

  cancelReservation() {
    return QueryService
      .delete(`/schedule/reservations/${this.state.reservation.id}/cancel`)
      .then(_ => {
        this.setState({ errors: [] });
        this.props.onAction()
      })
      .catch(err => this.setState({ errors: err }));
  }

  addPayment() {
    const reservation = this.state.reservation;
    reservation.payments.unshift({
      type: "",
      amount: null,
      reservationId: reservation.id || 0
    });
    this.setState({ reservation });
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
          {reservation.administrator && <Typography variant="caption">
            Администрирал:
            <Typography>{reservation.administrator.name}</Typography>
          </Typography>}

          <EnumSelect
            label="Вид резервация:"
            value={reservation.type}
            fullWidth={false}
            onChange={this.handleChange('type')}
            EnumValues={ReservationType}
            EnumName="ReservationType" />

          {(reservation.type == ReservationType.USER || reservation.type == ReservationType.SUBSCRIPTION)
            && <AsyncSelect
              label="Потребител"
              value={reservation.customer}
              query="users"
              noOptionsMessage={() => 'Няма намерени потребители'}
              formatOptionLabel={(option) => <Typography component="span">
                {option.name}
                <Typography component="span" variant="caption">{option.email}</Typography>
              </Typography>}
              onChange={this.handleCustomChange('customer')}
            />}

          {/* {reservation.type == ReservationType.SUBSCRIPTION
            && <AsyncSelect
              label="Потребител"
              value={reservation.customer}
              query="users"
              noOptionsMessage={() => 'Няма намерени потребители'}
              formatOptionLabel={(option) => <Typography component="span">
                {option.name}
                <Typography component="span" variant="caption">{option.email}</Typography>
              </Typography>}
              onChange={this.handleCustomChange('customer')}
            />} */}

          {reservation.type == ReservationType.SUBSCRIPTION && reservation.customer
            && <AsyncSelect
              disableSearch={true}
              label="Абонамент"
              value={reservation.subscription}
              query="subscriptions"
              filter={{
                seasonId: reservation.seasonId,
                userId: reservation.customerId
              }}
              noOptionsMessage={() => 'Няма регистрирани абонаменти'}
              formatOptionLabel={(option) => <Typography component="span">
                Абонамент {l10n_text(option.type, "SubscriptionType")}
                <Typography component="span" variant="caption" style={{ display: 'inline', marginLeft: '1rem' }}>{option.season.name}</Typography>
                <Typography component="span" variant="caption">{option.usedHours}/{option.totalHours}</Typography>
              </Typography>}
              onChange={this.handleCustomChange('subscription')}
            />}

          <Typography variant="subheading" style={{ marginTop: '1rem', alignItems: 'center', display: 'flex' }}>
            Плащания
            <IconButton
              color="primary"
              onClick={() => this.addPayment()}
            >
              <AddIcon />
            </IconButton>
          </Typography>

          {reservation.payments && reservation.payments.map((payment, index) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid darkgrey' }} key={index}>

                <EnumSelect
                  style={{ width: '100px' }}
                  label="Вид плащане"
                  value={payment.type}
                  onChange={this.handlePaymentChange('type', index)}
                  EnumValues={ReservationPayment}
                  EnumName="ReservationPayment" />

                {payment.type == ReservationPayment.CASH
                  && <TextField
                    label="Стойност"
                    value={payment.amount}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Лв</InputAdornment>
                    }}
                    onChange={this.handlePaymentChange('amount', index)}
                  />}

                {(payment.type == ReservationPayment.SUBS_ZONE_1 || payment.type == ReservationPayment.SUBS_ZONE_2)
                  && reservation.customer
                  && <AsyncSelect
                    disableSearch={true}
                    label="Абонамент"
                    value={payment.subscription}
                    query="subscriptions"
                    filter={{
                      seasonId: reservation.seasonId,
                      userId: reservation.customerId,
                      type: payment.type,
                      onlyAvailable: true
                    }}
                    noOptionsMessage={() => 'Няма абонаменти с часове за отиграване'}
                    formatOptionLabel={(option) => <Typography component="span">
                      Абонамент {l10n_text(option.type, "SubscriptionType")}
                      <Typography component="span" variant="caption" style={{ display: 'inline', marginLeft: '1rem' }}>{option.season.name}</Typography>
                      <Typography component="span" variant="caption">{option.usedHours}/{option.totalHours}</Typography>
                    </Typography>}
                    onChange={this.handlePaymentSubscriptionChange(index)}
                  />}

                {/* <span style={{ cursor: 'pointer' }} onClick={() => {
                  this.state.reservation.payments.splice(index, 1);
                  this.setState({ reservation: this.state.reservation });
                }}>
                  <ClearIcon style={{ color: 'darkred' }} />
                </span> */}
                <div style={{ margin: '1rem 0 .3rem 0' }}>
                  <Button variant="contained" color="secondary" size="small"
                    onClick={() => {
                      this.state.reservation.payments.splice(index, 1);
                      this.setState({ reservation: this.state.reservation });
                    }}
                  >
                    Изтриване
                </Button>
                </div>
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

          {this.state.errors && this.state.errors.length > 0
            && <div style={{ margin: '1rem 0', color: 'red' }}>
              {this.state.errors.map((err, index) => {
                return (
                  <div key={index}><em>{index + 1}. {ErrorTexts[err]}</em></div>
                );
              })}
            </div>}

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
            onClick={() => this.cancelReservation()}
          >
            Отмяна на резервацията
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

const ErrorTexts = {
  'exist': 'Резервация за този ден, час и корт вече съществува.',
  'typeRequired': '"Вид резервация" е задължително поле',
  'customerRequired': '"Потребител" е задължително поле, когато вид резервация е "Абонат" или "Потребител".',
  'subscriptionRequired': '"Абонамент" е задължително поле, когато вид резервация е "Абонат".',
  'usedHoursExceedTotalHours': 'Абонаментът няма свободни часове',
  'paymentSubscriptionRequired': '"Абонамент" е задължително поле, когато вид плащане е "Отиграване на абонамент".',
  'typeSubscriptionAndHasPaymentSubscription': 'Не може едновременно вид резервация да е "Абонат" и да има вид плащане "Отиграване на абонамент".',
  'maxAllowedTimeDiff': 'Резервацията не може да бъде отказана, защото остават по-малко часове от минимално допустимите часове за отказ.',
  'reservationInThePast': 'Часът за тази резервация вече е минал.'
};

export default EditReservationModal;