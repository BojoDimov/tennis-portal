import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';

class AccountActivation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      success: false,
      timer: 5
    };
    this.interval = null;
  }

  componentDidMount() {
    const token = this.props.location.search.split('?token=')[1];
    return QueryService
      .get(`/users/activation?token=${token}`)
      .then(_ => {
        this.setState({ success: true, err: false });
        this.interval = setInterval(() => {
          if (this.state.timer === 0) {
            clearInterval(this.interval);
            this.props.history.replace('/');
          } else {
            this.setState({ timer: this.state.timer - 1 });
          }
        }, 1000);
      })
      .catch(_ => this.setState({ err: true, success: false }));
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="container">
        <Paper className={classes.root}>
          <Typography align="center" variant="headline">Активация на акунт</Typography>
          {this.state.success && <Typography align="center" variant="subheading" color="primary" className={classes.success}>
            Активацията на Вашият акаунт беше успешна!
        </Typography>}

          {this.state.success && <Typography align="center" variant="headline" style={{ fontWeight: 700, fontSize: '1.3em' }}>{this.state.timer}</Typography>}

          {this.state.err && <Typography align="center" variant="subheading" color="secondary" className={classes.error}>
            Невалиден или изтекъл ключ за активация.
        </Typography>}
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    padding: '3rem',
    [theme.breakpoints.down('sm')]: {
      height: '100vh'
    }
  },
  success: {
    marginTop: '2rem',
    color: theme.palette.primary.dark,
    fontWeight: '700'
  },
  error: {
    marginTop: '2rem',
    color: theme.palette.secondary.dark,
    fontWeight: '700'
  }
});

export default withStyles(styles)(AccountActivation);