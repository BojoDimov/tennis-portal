import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';

class RecoveryStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: null,
      success: false
    };
  }

  issueRecoverEmail() {
    this.setState({ error: null, success: false });
    return QueryService
      .get(`/users/recovery/step1?email=${this.state.email}`)
      .then(_ => {
        this.setState({ success: true })
        setTimeout(() => this.props.history.replace('/'), 5000);
      })
      .catch(err => this.setState({ error: err }));
  }

  render() {
    const { classes } = this.props;

    return <div className="container">
      <Paper elevation={0} className={classes.root}>
        <Typography variant="headline">Възстановяване на забравена парола</Typography>
        <TextField
          id="email"
          label="E-mail"
          type="text"
          value={this.state.email}
          fullWidth={true}
          error={this.state.error}
          onChange={e => this.setState({ email: e.target.value })}
        />

        {this.state.success && <Typography
          variant="subheading"
          color="primary"
          className={classes.success}>
          Успешно изпратен имейл с инструкции за възстановяване на парола.
        </Typography>}

        {this.state.error && <Typography
          variant="subheading"
          color="secondary"
          className={classes.error}>
          {this.state.error.message}
        </Typography>}

        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: '1rem' }}
          onClick={() => this.issueRecoverEmail()}
        >
          Изпрати
        </Button>
      </Paper>
    </div>
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

export default withStyles(styles)(RecoveryStep1);