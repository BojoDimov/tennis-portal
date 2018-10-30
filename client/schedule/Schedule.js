import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import Reservation from './reservation/Reservation';
import Calendar from './calendar/Calendar';
import Legend from './Legend';
import { getHour } from '../utils';

const scrollButton = (theme) => ({
  zIndex: 1100,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  position: 'absolute',
  boxShadow: `0 0 20px ${theme.palette.primary.dark}`,
  borderRadius: '50%',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  opacity: '.9'
});

const styles = (theme) => ({
  hours: {
    width: '10px',
    textAlign: 'center'
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: .5
  },
  scrollLeft: {
    ...scrollButton(theme),
    top: '50%',
    left: '5px'
  },
  scrollRight: {
    ...scrollButton(theme),
    top: '50%',
    right: '5px'
  }
});


class Schedule extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      counter: 0,
      season: {},
      courts: [],
      reservations: [],
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    };

    const rootRef = document.getElementById('root');
    rootRef.onscroll = () => {
      const needScrollBtns = rootRef.clientWidth <= 600;
      const tableInViewport = rootRef.scrollTop + 200 >= this.tableRef.offsetTop;

      if (needScrollBtns && tableInViewport)
        this.btnContainerRef.style.display = 'block';
      else
        this.btnContainerRef.style.display = 'none';
    }
  }

  componentDidMount() {
    QueryService
      .get(`/schedule/config`)
      .then(config => this.setState(config));

    this.getData(this.state.date);
  }

  getData(date) {
    return QueryService
      .post(`/schedule/reservations/filter`, { date })
      .then(reservations => this.setState({ reservations }));
  }

  getReservation(hour, court) {
    const sameReservation = (e) => {
      const d = new Date(e.date);
      return e.courtId == court.id && e.hour == hour
        && d.getFullYear() == this.state.date.getFullYear()
        && d.getMonth() == this.state.date.getMonth();
    };
    const existing = this.state.reservations.find(e => sameReservation(e));

    return (existing || this.constructReservation(this.state.date, hour, court));
  }

  constructReservation(date, hour, court) {
    return {
      date: date,
      hour: hour,
      court: court,
      courtId: court.id,
      info: '',
      type: '',
      payments: []
    }
  }

  scroll(mode) {
    if (mode === 'left')
      this.tableRef.scrollLeft = this.tableRef.scrollLeft - 300;
    if (mode === 'right')
      this.tableRef.scrollLeft = this.tableRef.scrollLeft + 300;
  }

  render() {
    const { classes } = this.props;
    const { season, courts, date } = this.state;

    return (
      <UserService.WithApplicationMode>
        {mode => <div className="container">
          <Paper style={{ padding: '1rem' }}>
            <Typography align="center" variant="headline" gutterBottom={true}>
              График - {this.state.date.toLocaleDateString()}
            </Typography>
            <Calendar
              value={date}
              onChange={value => {
                this.setState({ date: value });
                this.getData(value);
              }}
            />

            <Legend />

            <div style={{ overflowX: 'auto', scrollBehavior: 'smooth' }} ref={ref => this.tableRef = ref}>

              <div ref={ref => this.btnContainerRef = ref} style={{ display: 'none' }}>
                <div className={classes.scrollLeft} onClick={() => this.scroll('left')} >
                  <ChevronLeftIcon />
                </div>

                <div className={classes.scrollRight} onClick={() => this.scroll('right')}>
                  <ChevronRightIcon />
                </div>
              </div>

              <Table style={{ minWidth: '600px' }} >
                <TableHead>
                  <TableRow>
                    <TableCell padding="none" style={{ textAlign: 'center' }}>Час\Корт</TableCell>
                    {courts.map(court => {
                      return (
                        <TableCell
                          padding="none"
                          style={{ textAlign: 'center' }}
                          key={court.id}
                        >
                          {court.name}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getRange(season.workingHoursStart, season.workingHoursEnd - 1).map(hour => {
                    return (
                      <TableRow key={hour}>
                        <TableCell padding="none"
                          classes={{
                            root: classes.hours
                          }}
                        >
                          {getHour(hour)}
                        </TableCell>
                        {courts.map(court =>
                          <Reservation
                            mode={mode}
                            key={court.id}
                            reservation={this.getReservation(hour, court)}
                            onChange={_ => this.getData(date)}
                          />
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </div>}
      </UserService.WithApplicationMode>
    );
  }
}

function getRange(start, end) {
  if (!start || !end)
    return [];
  return [...new Array(end - start + 1).keys()].map(e => e + start);
}

export default withStyles(styles)(Schedule);