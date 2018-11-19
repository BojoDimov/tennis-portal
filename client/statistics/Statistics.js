import moment from 'moment';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Calendar from '../components/calendar/Calendar';
import QueryService from '../services/query.service';
import { SimpleChart, SvgBarplot } from './SimpleChart';
import { StatisticsType, ReservationPayment, EnumLocalization } from '../enums';

class StatisticsRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().startOf('date'),
      type: StatisticsType.DAILY,
      data: []
    };

    this.handleCalendarChange = (date) => {
      this.setState(date);
      this.getData(date);
    }
  }

  componentDidMount() {
    this.getData(this.state.date);
  }

  getData(date) {
    const { type } = this.state;
    return QueryService
      .post('/statistics', { date: date.format('YYYY-MM-DD'), type })
      .then(data => this.setState({ data }));
  }

  render() {
    const { year, month, date, type, data } = this.state;

    return (
      <div className="container">
        <Paper style={{ padding: '1rem' }}>
          <Typography></Typography>
          <Typography align="center" variant="headline" gutterBottom={true}>
            Справки
          </Typography>
          <Calendar
            value={date}
            onChange={this.handleCalendarChange}
          />

          <SimpleChart data={data} classifier={ReservationPayment} localization={EnumLocalization['ReservationPayment']} />
          <SvgBarplot data={data} classifier={ReservationPayment} localization={EnumLocalization['ReservationPayment']} />
        </Paper>
      </div>
    );
  }
}

function toPayments(data) {
  return data
    .reduce((acc, curr) => acc.concat(curr.payments), []);
}

export default StatisticsRoot;