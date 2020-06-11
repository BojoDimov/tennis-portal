import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';

class RecoveryStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      password: '',
      confirmPassword: '',
      error: null,
      success: false
    };
  }

  componentDidMount() {
    let token = this.props.location.search.split('?token=');
    if (token.length > 1)
      token = token[1].trim();
    else
      token = "";

    this.setState({ token });
  }

  recover() {
    this.setState({ error: null, success: false });
    return QueryService
      .post(`/users/recovery/step2`, { token: this.state.token, password: this.state.password, confirmPassword: this.state.confirmPassword })
      .then(_ => {
        this.setState({ success: true });
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
          id="password"
          label="Парола"
          type="password"
          value={this.state.password}
          fullWidth={true}
          error={this.state.error}
          onChange={e => this.setState({ password: e.target.value })}
        />

        <TextField
          id="confirmPassword"
          label="Повтори парола"
          type="password"
          value={this.state.confirmPassword}
          fullWidth={true}
          error={this.state.error}
          onChange={e => this.setState({ confirmPassword: e.target.value })}
        />

        {this.state.success && <Typography
          variant="subheading"
          color="primary"
          className={classes.success}>
          Смяната на паролата ви беше успешна!
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
          onClick={() => this.recover()}
        >
          Потвърждаване
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

export default withStyles(styles)(RecoveryStep2);