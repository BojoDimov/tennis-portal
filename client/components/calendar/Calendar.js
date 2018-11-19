import moment from 'moment';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import UserService from '../../services/user.service';
import DateComponent from './DateComponent';

const styles = (theme) => ({
  root: {
    paddingLeft: '1.3rem',
    paddingRight: '2.3rem',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  formControl: {
    width: '120px',
    margin: '.5rem',
    [theme.breakpoints.down('xs')]: {
      margin: '.5rem',
      width: '100%'
    }
  }
});

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    const today = moment().startOf('date');
    this.state = {
      year: today.get('year'),
      month: today.get('month'),
      day: today.get('date'),
      date: today
    };
    this.years = [2016, 2017, 2018, 2019];
    this.monts = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];

    this.handleChange = (prop) => (e) => {
      const state = this.state;
      state[prop] = e.target.value;
      this.setState(state);
      if (this.props.emitDateOnAnyChange)
        this.props.onChange(moment(state.date).set(prop, state[prop]));
    }
  }

  componentDidMount() {
    this.setState({
      year: this.props.value.get('year'),
      month: this.props.value.get('month'),
      day: this.props.value.get('date')
    });
  }

  render() {
    const { classes, onChange } = this.props;
    const { year, month, day } = this.state;

    return (
      <div style={{ marginBottom: '1rem' }}>
        <div className={classes.root}>
          <FormControl className={classes.formControl}>
            <Select
              value={month}
              onChange={this.handleChange('month')}
            >
              {this.monts.map((month, index) => {
                return (
                  <MenuItem key={index} value={index}>{month}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Select
              value={year}
              onChange={this.handleChange('year')}
            >
              {this.years.map(year => {
                return (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <UserService.WithApplicationMode>
          {mode => <DateComponent
            year={year}
            month={month}
            day={day}
            availiableDaysAhead={14}
            mode={mode}
            onChange={(date) => {
              this.setState({ date });
              return onChange(date);
            }}
          />}
        </UserService.WithApplicationMode>
      </div>
    );
  }
}

export default withStyles(styles)(Calendar);