import moment from 'moment';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Calendar from '../components/calendar/Calendar';
import QueryService from '../services/query.service';
import { StatisticsType, ReservationPayment, ReservationType } from '../enums';
import { UserPlayedHours, StatisticByClassifier } from './MonthlyStatistics';

class StatisticsRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().startOf('date'),
      type: StatisticsType.MONTHLY,
      data: []
    };

    this.handleCalendarChange = (date) => {
      this.setState({ date });
      this.getData(date, this.state.type);
    }

    this.handleStatisticsChange = (_, value) => {
      this.setState({ type: value });
      this.getData(this.state.date, value);
    }
  }

  componentDidMount() {
    this.getData(this.state.date, this.state.type);
  }

  getData(date, type) {
    return QueryService
      .post('/statistics', { date: date.format('YYYY-MM-DD'), type })
      .then(data => this.setState({ data }));
  }

  render() {
    const { date, type, data } = this.state;

    return (
      <div className="container">
        <Paper style={{ padding: '1rem' }}>
          <Typography></Typography>
          <Typography align="center" variant="headline" gutterBottom={true}>
            Справки
          </Typography>
          <Calendar
            emitDateOnAnyChange={true}
            value={date}
            onChange={this.handleCalendarChange}
          />

          <Tabs value={type} onChange={this.handleStatisticsChange} textColor="primary">
            <Tab value={StatisticsType.MONTHLY} label="Месечна"></Tab>
            <Tab value={StatisticsType.DAILY} label="Дневна"></Tab>
          </Tabs>

          {type == StatisticsType.MONTHLY && <div style={{ margin: '2rem 0' }}>
            <Typography variant="subheading">Справка по потребители</Typography>
            <UserPlayedHours data={data} />
          </div>}

          {type == StatisticsType.MONTHLY && <div style={{ margin: '2rem 0' }}>
            <Typography variant="subheading">Справка по вид резервация</Typography>
            <StatisticByClassifier
              label1="Вид резервация"
              label2="Регистрирани резервации"
              classifier={ReservationType}
              translation="ReservationType"
              data={data} />
          </div>}

          <div style={{ margin: '2rem 0' }}>
            <Typography variant="subheading">Справка по регистрирани плащания</Typography>
            <StatisticByClassifier
              label1="Метод на плащане"
              label2="Регистрирани плащания"
              classifier={ReservationPayment}
              translation="ReservationPayment"
              customFn={paymentsAmountAccumulator}
              customValueSuffix=" лв."
              data={reduceToPayments(data)} />
          </div>
        </Paper>
      </div>
    );
  }
}

function reduceToPayments(data) {
  return data.reduce((acc, curr) => acc.concat(curr.payments), []);
}

function paymentsAmountAccumulator(current, payment) {
  if (payment.amount)
    return (current || 0) + parseFloat(payment.amount);
  else return current;
}

export default StatisticsRoot;