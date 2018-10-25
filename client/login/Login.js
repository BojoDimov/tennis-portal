import React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import { dispatchEvent } from '../services/events.service';

const styles = (theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 250,
    margin: '1.5rem auto'
  },
  link: {
    color: theme.palette.primary.main,
    padding: '.3rem 0',
    '&:hover': {
      color: theme.palette.primary.dark,
      borderBottom: '1px solid',
      borderColor: theme.palette.primary.main,
    }
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = (name) => (event) => {
      this.setState({
        [name]: event.target.value
      });
    }
  }

  login() {
    QueryService
      .post(`/login`, this.state)
      .then(({ token }) => {
        UserService.login(token);
        this.props.onClose();
      })
      .catch(err => console.log('There have been an error:', err));
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.form}>
        <TextField
          label="Email"
          fullWidth={true}
          value={this.state.email}
          onChange={this.handleChange('email')}
        />

        <TextField
          label="Парола"
          fullWidth={true}
          type="password"
          value={this.state.password}
          onChange={this.handleChange('password')}
        />

        <Button variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}
          onClick={() => this.login()}
        >
          Вход
        </Button>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Link to="/recovery" className={classes.link} onClick={this.props.onClose}>
            Забравена парола?
        </Link>
        </div>

      </form>
    );
  }
}

export default withStyles(styles)(Login);