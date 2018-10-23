import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Home from './Home';
import AppRouting from './app.routing';
import SignIn from '../login/SignIn';
import Navigation from '../menu/Navigation';
import { dispatchEvent, catchEvent } from '../services/events.service';
import UserService from '../services/user.service';
import NavigationModel from '../menu/navigation.model';
import { ApplicationMode } from '../enums';
import theme from '../theme';
import './app.styles.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    const user = UserService.getUser();
    this.state = {
      applicationMode: (user ? (
        user.isAdmin ? ApplicationMode.ADMIN : ApplicationMode.USER)
        : ApplicationMode.GUEST),
      currentRoute: 0
    }

    this.handleLoginTab = (event, index) => {
      this.setState({ index });
    };
  }

  componentDidMount() {
    catchEvent('not-found', () => this.props.history.replace('/oops'));
    catchEvent('login', () => this.setState({
      applicationMode: UserService.isAdmin() ? ApplicationMode.ADMIN : ApplicationMode.USER
    }));
    catchEvent('logout', () => {
      this.setState({
        applicationMode: ApplicationMode.GUEST
      });
      this.props.history.replace('/');
    });
    this.onRouteChanged(this.props.location);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.onRouteChanged(this.props.location);
    }
  }

  onRouteChanged(location) {
    var route = (NavigationModel.routes
      .find(route => location.pathname.indexOf(route.to) != -1)
      || NavigationModel.adminRoutes
        .find(route => location.pathname.indexOf(route.to) != -1));
    if (route)
      this.setState({ currentRoute: route.id });
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiThemeProvider theme={theme}>
          <UserService.SetApplicationMode value={this.state.applicationMode}>
            <NavigationModel.SetCurrentRoute value={this.state.currentRoute}>
              <div className="wrapper">
                <Navigation />
                {/* <Home /> */}
                <SignIn />
                <AppRouting />
              </div>
            </NavigationModel.SetCurrentRoute>
          </UserService.SetApplicationMode>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withRouter(App);