import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import UserModel from '../users/user.model';

class UserSubscriptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        subscriptions: []
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user != this.props.user && this.props.user != null)
      this.setState({ user: this.props.user });
  }

  save() {
    const { user } = this.state;
  }

  render() {
    const { isOpen, onClose, classes } = this.props;
    const { user } = this.state;

    return (
      <Dialog open={isOpen} onClose={onClose} classes={{ paper: classes.root }}>
        <DialogTitle>
          <DialogContentText variant="headline">
            Абонаменти на {user.name}
          </DialogContentText>
        </DialogTitle>
        <DialogContent>

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

export default withStyles(styles)(UserSubscriptionsModal);