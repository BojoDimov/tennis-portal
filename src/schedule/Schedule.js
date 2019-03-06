import moment from 'moment';
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
import ReplayIcon from '@material-ui/icons/Replay';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import { Button } from '@material-ui/core';

import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import Reservation from './reservation/Reservation';
import ShuffleItem from './reservation/ShuffleItem';
import Calendar from '../components/calendar/Calendar';
import Legend from './Legend';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { getHour } from '../utils';
import { ApplicationMode } from '../enums';

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
    this.state = {
      administrator: UserService.getUser(),
      counter: 0,
      season: null,
      courts: [],
      reservations: [],
      date: moment().startOf('date'),
      shuffle: null
    };

    const rootRef = document.getElementById('root');
    rootRef.onscroll = () => {
      if (!this.tableRef)
        return;

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
      .post(`/schedule/reservations/filter`, { date: date.format('YYYY-MM-DD') })
      .then(reservations => this.setState({ reservations }));
  }

  getReservation(hour, court) {
    const sameReservation = (e) => {
      return e.courtId == court.id && e.hour == hour
    };

    const existing = this.state.reservations.find(e => sameReservation(e));
    return (existing || this.constructReservation(this.state.date, hour, court));
  }

  shuffle() {
    const shuffle = this.state.shuffle;
    if (!shuffle || shuffle.length < 2)
      return;

    this.setState({ shuffleErrors: null });

    return QueryService
      .post('/schedule/shuffle', shuffle)
      .then(_ => {
        this.getData(this.state.date);
        this.setState({ shuffle: null });
      })
      .catch(err => this.setState({ shuffleErrors: err }));
  }

  shuffleOnSelect(item) {
    //console.log('select', item);
    const shuffle = this.state.shuffle;
    shuffle.unshift(item);
    shuffle.splice(2, 1);
    this.setState({ shuffle });
  }

  shuffleOnUnselect(index) {
    //console.log('unselect', index);
    const shuffle = this.state.shuffle;
    shuffle.splice(index, 1);
    this.setState({ shuffle });
  }

  constructReservation(date, hour, court) {
    return {
      date: date.format('YYYY-MM-DD'),
      hour: hour,
      court: court,
      courtId: court.id,
      season: this.state.season,
      seasonId: this.state.season.id,
      administrator: this.state.administrator,
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

    if (!season)
      return <Paper style={{ padding: '1rem' }} className="container">
        <Typography variant="headline" align="center" color="secondary">Няма текущ сезон</Typography>
      </Paper>

    return (
      <UserService.WithApplicationMode>
        {mode => <div className="container">
          <Paper style={{ padding: '1rem' }}>
            <Typography align="center" variant="headline" gutterBottom={true}>
              График - {date.format('DD.MM.YYYY')}
            </Typography>
            <Calendar
              value={date}
              onChange={date => {
                this.setState({ date, shuffle: null });
                this.getData(date);
              }}
            />

            <Legend />
            <div>
              <Button variant="outlined" color="primary" size="small"
                style={{ marginRight: '.3rem' }}
                onClick={() => this.getData(date)}
              >
                <ReplayIcon />
                <span style={{ marginLeft: '.3rem' }}>Презареди</span>
              </Button>

              {mode == ApplicationMode.ADMIN
                && <React.Fragment>
                  {this.state.shuffle
                    && <React.Fragment>
                      <ConfirmationDialog
                        title="Разместване на резервации"
                        body={<Typography>Сигурни ли сте че искате да направите разместването?</Typography>}
                        onAccept={() => this.shuffle()}
                      >
                        <Button variant="contained" color="primary">
                          Запис
                      </Button>
                      </ConfirmationDialog>
                      <Button variant="outlined" color="primary"
                        style={{ marginLeft: '.3rem' }}
                        onClick={() => this.setState({ shuffle: null, shuffleErrors: null })}
                      >
                        Отказ
                      </Button>
                    </React.Fragment>}
                  {!this.state.shuffle && <Button variant="outlined" color="primary" size="small" onClick={() => this.setState({ shuffle: [] })}>
                    <ShuffleIcon />
                    Разместване
                  </Button>}
                </React.Fragment>}
            </div>

            {this.state.shuffleErrors
              && <div style={{ margin: '1rem 0', color: 'red' }}>
                <span><em>{ErrorTexts[this.state.shuffleErrors.message]}</em></span>
              </div>}



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

                        {courts.map(court => {
                          if (!this.state.shuffle)
                            return (
                              <Reservation
                                mode={mode}
                                key={court.id}
                                season={this.state.season}
                                reservation={this.getReservation(hour, court)}
                                onChange={_ => this.getData(date)}
                              />
                            );
                          else
                            return (
                              <ShuffleItem
                                key={court.id}
                                shuffle={this.state.shuffle}
                                reservation={this.getReservation(hour, court)}
                                onSelect={(e) => this.shuffleOnSelect(e)}
                                onUnselect={(e) => this.shuffleOnUnselect(e)}
                              />
                            )
                        })}
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

const ErrorTexts = {
  'invalid': 'Моля изберете две полета за резервация',
  'invalidTime': 'Не може да резмествате вече минали резервации'
};

export default withStyles(styles)(Schedule);