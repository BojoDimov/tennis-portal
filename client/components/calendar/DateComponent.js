import moment from 'moment';
import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import { ApplicationMode } from '../../enums';

const styles = (theme) => {
  return {
    tabsRoot: {
    },
    tab: {
      backgroundColor: 'white',
      color: theme.palette.primary.dark,
      [theme.breakpoints.down('xl')]: {
        width: '60px',
        minWidth: '0px',
        minHeight: '0px',
        fontWeight: 700,
        border: '.5px solid lightgrey',
      }
    },
    selectedTab: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      border: 'none'
    },
    todayTab: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.contrastText,
      border: 'none'
    },
    disabledTab: {
      color: 'grey',
      fontWeight: 500,
      backgroundColor: 'whitesmoke'
    },
    tabsScroller: {
      [theme.breakpoints.up('md')]: {
        overflow: 'hidden'
      }
    },
    tabsIndicator: {
      backgroundColor: theme.palette.primary.main
    },
    tabsScrollButtons: {
      color: theme.palette.primary.main,
      flexBasis: '30px'
    }
  };
};

class DateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: new Date().getDate() - 1,
      previousSelected: null
    };
    this.weekDays = ['нед', 'пон', 'втор', 'ср', 'четв', 'пет', 'съб'];
  }

  componentDidMount() {
    this.setState({ selected: this.props.day - 1 });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.month != this.props.month || prevProps.year != this.props.year) {
      if (this.state.previousSelected
        && this.state.previousSelected.get('year') == this.props.year
        && this.state.previousSelected.get('month') == this.props.month) {
        this.props.onChange(this.state.previousSelected)
        this.setState({
          selected: this.state.previousSelected.get('date') - 1,
          previousSelected: null
        });
      }

      else if (this.state.previousSelected == null)
        this.setState({
          selected: false,
          previousSelected: moment({ year: prevProps.year, month: prevProps.month, date: this.state.selected + 1 })
        });
      else
        this.setState({ selected: false });
    }
  }

  getLabel(day) {
    let date = new Date();
    date.setDate(day);

    return (
      <div>
        {day < 10 ? '0' : ''}
        {day}
        <div>{this.weekDays[date.getDay()]}</div>
      </div>
    );
  }

  getDays() {
    const { year, month } = this.props;

    const monthSizes = [31,
      (year % 100 != 0
        && (year % 4 == 0
          || year % 400 == 0) ? 29 : 28),
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const start = 1;
    const end = monthSizes[month];

    return [...new Array(end - start + 1).keys()].map(k => k + start);
  }

  isDisabled(day) {
    if (this.props.mode == ApplicationMode.ADMIN)
      return false;
    const { year, month, availiableDaysAhead } = this.props;
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    const targetDate = new Date(year, month, day);
    const today = new Date();
    const diff = Math.floor((today - targetDate) / MS_PER_DAY);
    return diff > 0 || diff < -availiableDaysAhead;
  }

  isToday(day) {
    const { year, month } = this.props;
    const today = new Date();
    return year == today.getFullYear() && month == today.getMonth() && day == today.getDate();
  }

  render() {
    const { year, month, classes, onChange } = this.props;
    const today = new Date().getDate();

    return (
      <Tabs
        classes={{
          root: classes.tabsRoot,
          scroller: classes.tabsScroller,
          indicator: classes.tabsIndicator,
          scrollButtons: classes.tabsScrollButtons
        }}
        value={this.state.selected}
        onChange={(_, value) => {
          this.setState({ selected: value });
          onChange(moment({ year, month, date: value + 1 }));
        }}
        scrollable
        scrollButtons="on">
        {this.getDays().map(day => {
          let rootClass = classes.tab;
          if (this.isToday(day) && this.state.selected != (today - 1))
            rootClass = rootClass + ` ${classes.todayTab}`;

          return (
            <Tab
              classes={{
                root: rootClass,
                selected: classes.selectedTab,
                disabled: classes.disabledTab
              }}
              disabled={this.isDisabled(day)}
              key={day}
              label={this.getLabel(day)}
            />
          );
        })}
      </Tabs>
    );
  }
}

export default withStyles(styles)(DateComponent);