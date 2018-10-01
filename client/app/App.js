import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import AppRouting from './app.routing';
import SignIn from '../login/SignIn';
import Navigation from '../menu/Navigation';
import { dispatchEvent, catchEvent } from '../services/events.service';
import theme from '../theme';
import './app.styles.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }

    this.handleLoginTab = (event, index) => {
      this.setState({ index });
    };
  }

  componentDidMount() {
    catchEvent('not-found', () => this.props.history.push('/oops'));
    setTimeout(() => this.onRouteChanged(this.props.location), 3000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.onRouteChanged(this.props.location);
    }
  }

  onRouteChanged(location) {
    dispatchEvent('location', location);
  }

  render() {
    const { index } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiThemeProvider theme={theme}>
          <div className="wrapper">
            <Navigation />
            <SignIn />
            <AppRouting />
          </div>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withRouter(App);