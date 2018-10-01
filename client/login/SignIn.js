import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
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
  }
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      open: false
    }

    this.handleTabChange = (event, index) => {
      this.setState({ index });
    };
  }

  componentDidMount() {
    //   console.log('opaa');
    //   
    EventService.catchEvent('menu-login', () => this.setState({ open: true }));
  }

  render() {
    const { index, open } = this.state;
    const { classes, fullScreen } = this.props;

    return (
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
        </DialogTitle>
        <DialogContent
          className={classes.centered}>
          <SwipeableViews
            className={classes.smallContainer}
            index={index}
            onChangeIndex={(index) => this.handleTabChange(null, index)}
          >
            <Login />
            <Registration />
          </SwipeableViews>
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(SignIn)
);