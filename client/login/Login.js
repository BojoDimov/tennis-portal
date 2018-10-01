import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 250,
    margin: 'auto'
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.handleChange = (name) => (event) => {
      this.setState({
        [name]: event.target.value
      });
    }
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

        <Button variant="outlined" color="primary" size="large">
          Вход
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(Login);