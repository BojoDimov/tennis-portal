import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Hidden from '@material-ui/core/Hidden';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import UserService from '../services/user.service';
import { catchEvent, dispatchEvent } from '../services/events.service';

import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  list: {
    width: 250
  },
  root: {
    justifyContent: 'flex-end',
    paddingRight: 0
  },
  link: {
    textDecoration: 'none'
  }
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
      isLogged: UserService.isLogged(),
      isAdmin: UserService.isAdmin(),
      active: 0,
      routes: [
        { path: '/', name: 'Начало', isExact: true },
        { path: '/news', name: 'Новини' },
        { path: '/editions', name: 'Турнири' },
        { path: '/users', name: 'Играчи' }
      ]
    };

    catchEvent('location', ({ pathname }) => {
      let active = this.state.routes
        .findIndex((route) => {
          if (route.isExact)
            return route.path == pathname;
          else
            return pathname.indexOf(route.path) != -1;
        });

      this.setState({ active: active });
    });
  }

  render() {
    const { classes } = this.props;
    const { isLogged, isAdmin, routes, active } = this.state;

    return (
      <Toolbar className={`container ${classes.root}`} >

        {/* These are application routes */}
        <Hidden smDown>
          {routes.map((route, index) => {
            return (
              <Link
                key={index}
                to={route.path}
                className={classes.link}
              >
                <Button
                  variant={(active == index ? 'outlined' : 'text')}
                  color="primary"
                  size="large"
                >
                  {route.name}
                </Button>
              </Link>
            );
          })}
        </Hidden>

        {/* This is hidden if viewport is less than or equal to sm.
            If we are not logged we get the Login button.
            If we are logged we get the settings icon. */}
        <Hidden smDown>
          {!isLogged &&
            <Button variant="text" color="primary" size="large">
              <span onClick={() => dispatchEvent('menu-login')}>Вход</span>
            </Button>}

          {isLogged &&
            <IconButton
              color="primary"
              onClick={() => this.setState({ drawer: true })}
            >
              <SettingsIcon />
            </IconButton>
          }
        </Hidden>

        {/* This is hidden if viewport is more than or equal to md. */}
        <Hidden mdUp>
          <IconButton
            color="primary"
            onClick={() => this.setState({ drawer: true })}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>


        <SwipeableDrawer
          anchor="right"
          open={this.state.drawer}
          onClose={() => this.setState({ drawer: false })}
          onOpen={() => this.setState({ drawer: true })}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={() => this.setState({ drawer: false })}
            onKeyDown={() => this.setState({ drawer: false })}
          >
            <div className={classes.list}>

              <Hidden mdUp>
                <List>
                  {routes.map((route, index) => {
                    return (
                      <ListItem
                        key={index}
                        button
                      >
                        <Link
                          to={route.path}
                          className={classes.link}
                        >
                          <ListItemText primary={route.name} />
                        </Link>
                      </ListItem>
                    );
                  })}

                  {!isLogged &&
                    <ListItem button onClick={() => dispatchEvent('menu-login')}>
                      <ListItemText primary="Вход" />
                    </ListItem>
                  }
                </List>
              </Hidden>
            </div>
          </div>
        </SwipeableDrawer>
      </Toolbar >
    );
  }
}

Navigation.propTypes = {
  width: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withWidth()(Navigation));