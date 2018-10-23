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
    const today = new Date();
    super(props);
    this.state = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    };
    this.years = [2016, 2017, 2018, 2019];
    this.monts = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
  }

  componentDidMount() {
    this.setState({
      year: this.props.value.getFullYear(),
      month: this.props.value.getMonth(),
      day: this.props.value.getDate()
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
              onChange={e => this.setState({ month: e.target.value })}
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
              onChange={e => this.setState({ year: e.target.value })}
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
            onChange={onChange}
          />}
        </UserService.WithApplicationMode>
      </div>
    );
  }
}

export default withStyles(styles)(Calendar);