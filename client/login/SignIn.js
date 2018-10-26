import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';

import Login from './Login';
import Registration from './Registration';
import EventService from '../services/events.service';

const styles = (theme) => ({
  centered: {
    display: 'flex',
    justifyContent: 'center'
  },
  smallContainer: {
    width: 320
  },
  closeBtn: {
    position: 'absolute',
    color: theme.palette.primary.main,
    top: '5px',
    right: '5px',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.dark
    }
  }
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      open: false,
      successfulRegistration: false
    };

    this.handleTabChange = (event, index) => {
      this.setState({ index });
    };

    this.handleRegistration = () => {
      this.setState({ successfulRegistration: true, open: false });
      setTimeout(() => this.setState({ successfulRegistration: false }), 5000);
    }
  }

  componentWillMount() {
    EventService.catchEvent('menu-login', () => this.setState({ open: true }));
  }

  render() {
    const { index, open, successfulRegistration } = this.state;
    const { classes, fullScreen } = this.props;

    return (
      <React.Fragment>
        <Dialog
          open={open}
          fullScreen={fullScreen}
          onClose={() => this.setState({ open: false })}
          aria-labelledby="login-dialog"
        >
          <DialogTitle id="login-dialog"
            className={classes.centered}
          >
            <Tabs
              className={classes.smallContainer}
              centered={true}
              value={index}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Вход" key="1" />
              <Tab label="Регистрация" key="2" />
            </Tabs>
            <span className={classes.closeBtn} onClick={() => this.setState({ open: false })}>
              <ClearIcon />
            </span>
          </DialogTitle>
          <DialogContent
            className={classes.centered}>
            <SwipeableViews
              className={classes.smallContainer}
              index={index}
              onChangeIndex={(index) => this.handleTabChange(null, index)}
            >
              <Login onClose={() => this.setState({ open: false })} />
              <Registration onSuccess={this.handleRegistration} />
            </SwipeableViews>
          </DialogContent>
          <DialogActions>

          </DialogActions>
        </Dialog>

        <Dialog
          open={successfulRegistration}
          fullScreen={fullScreen}
          onClose={() => this.setState({ successfulRegistration: false })}
          aria-labelledby="successful-registration"
        >
          <DialogContent>
            <Typography variant="headline" color="primary">Регистрацията Ви беше успешна!</Typography>
            <Typography>На зададеният от Вас имейл е изпратено съобщение с което може да си активирате акаунта</Typography>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button variant="contained" color="primary" size="small"
              onClick={() => this.setState({ successfulRegistration: false })}
            >
              Добре
          </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(SignIn)
);