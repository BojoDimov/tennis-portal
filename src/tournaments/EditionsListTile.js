import React from 'react';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { ApplicationMode, Status } from '../enums';

class EditionsListTile extends React.Component {
  navigate() {
    const { edition, history, mode } = this.props;
    let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

    if (!hasPermission && edition.schemes && edition.schemes.length === 1)
      history.push(`/schemes/${edition.schemes[0].id}`);
    else
      history.push(`/editions/${edition.id}`);
  }

  render() {
    const { edition, classes, history } = this.props;

    let ongoingSuffix = '';
    if (moment(edition.startDate).isSameOrAfter(moment(), 'date'))
      ongoingSuffix = ' ongoing'

    return (
      <Paper elevation={1} className={classes.tileRoot + ongoingSuffix} onClick={() => this.navigate()}>
        <div className={classes.date_root + ongoingSuffix}>
          <Typography className="month_part">
            {getMonth(edition.startDate)}
          </Typography>
          <Typography className="date_part">
            {new Date(edition.startDate).getDate()}
          </Typography>
        </div>
        <div className={classes.name_root + ongoingSuffix}>
          <Typography className="title">{edition.name}</Typography>
          <Typography variant="caption">{edition.info}</Typography>
        </div>
        <div className={classes.info_root + ongoingSuffix}>
          <div>
            <Typography>
              Зима 2020
            </Typography>

            <Typography>
              64
            </Typography>
          </div>
          <div>

          </div>
        </div>
      </Paper>
    );
  }
}

function getMonth(date) {
  return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][new Date(date).getMonth()];
}

const styles = (theme) => ({
  tileRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: '.8em',
    marginBottom: '1em',
    cursor: 'pointer',
    background: 'linear-gradient(0deg, rgb(220, 220, 220) 0%, rgb(239, 239, 239) 100%)',
    '&.ongoing': {
      background: 'linear-gradient(0deg, rgb(239, 239, 239) 0%, rgb(253, 253, 253) 100%)'
    }
  },
  date_root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '60px',
    height: '60px',
    borderRadius: '3px',
    marginRight: ' 1em',
    backgroundColor: '#969696',
    '&.ongoing': {
      backgroundColor: theme.palette.secondary.main
    },
    '& .month_part': {
      fontSize: '.8em'
    },
    '& .date_part': {
      fontSize: '1.1em',
      fontWeight: 700
    },
    '& *': {
      color: 'white'
    }
  },
  name_root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    '& .title': {
      fontWeight: 700,
      fontSize: '1.5em'
    },
    '& *': {
      color: '#808080'
    },
    '&.ongoing *': {
      color: theme.palette.text.primary
    }
  },
  info_root: {
    fontWeight: 700,
    '& *': {
      fontWeight: 700
    },
    '& > div': {
      display: 'flex',
      '& > *': {
        marginRight: '.3em'
      }
    },
  }
});

export default withStyles(styles)(EditionsListTile);