import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';
import UserModel from '../../users/user.model';

class UserDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserModel.get(),
      errors: UserModel.getErrorsModel()
    }

    this.handleChange = (prop, custom = false) => (event) => {
      let user = this.state.user;
      user[prop] = (custom ? event : event.target.value);
      this.setState({ user });
    };
  }

  componentDidMount() {
    if (this.props.user)
      this.setState({ user: this.props.user });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user != this.props.user && this.props.user)
      this.setState({ user: this.props.user, errors: UserModel.getErrorsModel() });
  }

  save() {
    const { user } = this.state;

    if (user.id)
      return QueryService
        .post(`/users/${user.id}`, user)
        .then(_ => this.props.onChange())
        .catch(err => this.setState({ errors: err }));
    else
      return QueryService
        .post(`/users`, user)
        .then(_ => this.props.onChange())
        .catch(err => this.setState({ errors: err }));
  }

  render() {
    const { isOpen, onClose, classes, fullScreen } = this.props;
    const { user, errors } = this.state;
    if (!this.props.user)
      return null;

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <DialogContentText variant="headline">
            {user.name || 'Нов потребител'}
          </DialogContentText>
        </DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={user.isActive}
                onClick={() => this.handleChange('isActive', true)(!user.isActive)}
              />
            }
            label="Активен"
          />

          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={user.isTrainer}
                onClick={() => this.handleChange('isTrainer', true)(!user.isTrainer)}
              />
            }
            label="Треньор"
          />

          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={user.isTournamentAdmin}
                onClick={() => this.handleChange('isTournamentAdmin', true)(!user.isTournamentAdmin)}
              />
            }
            label="Турнири"
          />

          <UserModel.UserAccountData user={user} onChange={this.handleChange} errors={errors} />
          <UserModel.UserPlayerMainData user={user} onChange={this.handleChange} errors={errors} />

          <Typography
            style={{ margin: '1rem 0 .3rem 0' }}
            variant="subheading"
            color="primary">Допълнителна информация за акаунт</Typography>
          <UserModel.UserAccountSecondaryData user={user} onChange={this.handleChange} errors={errors} />
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.save()}>
            Запис
          </Button>
          <Button variant="outlined" color="primary" className={classes.btn} onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '600px'
  },
  btnContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '.3rem',
      width: '100%'
    }
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(UserDetailsModal)
);