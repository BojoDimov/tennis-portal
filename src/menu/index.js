import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserService from '../services/user.service';
import MenuContext from './menu.context';
import { dispatchEvent } from '../services/events.service';
import { ApplicationMode } from '../enums';
import {
  adminRoutes,
  desktopRoutes,
  userRoutes,
  tournamentAdditional
} from './menu.configuration';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    }

    this.login = () => {
      this.setState({ drawerOpen: false });
      dispatchEvent('menu-login');
    };

    this.logout = () => {
      this.setState({ drawerOpen: false });
      UserService.logout();
    }
  }

  mapToolbarRoute(route, currentRoute) {
    return (
      <Link to={route.to} key={route.id}>
        <Button color="primary" size="large" variant={route.id == currentRoute ? 'outlined' : 'text'}>
          {route.name}
        </Button>
      </Link>
    );
  }

  mapDrawerRoute(route) {
    return (
      <Link to={route.to} key={route.id}>
        <ListItem button onClick={() => this.setState({ drawerOpen: false })}>
          {route.Icon && <ListItemIcon style={{ width: '25px' }}>
            <route.Icon />
          </ListItemIcon>}
          {route.faIcon && <ListItemIcon style={{ width: '25px' }}>
            <FontAwesomeIcon icon={route.faIcon} style={{ marginLeft: '.2rem' }} />
          </ListItemIcon>}
          <ListItemText primary={route.name} />
        </ListItem>
      </Link>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <MenuContext.WithCurrentRoute>
        {currentRoute => (<UserService.WithApplicationMode>
          {mode => (
            <div className={"container " + classes.root}>
              <img src="assets/logo3.png" />
              <Toolbar className={classes.toolbar} >
                <Hidden smDown>
                  {desktopRoutes.map(route => this.mapToolbarRoute(route, currentRoute))}
                </Hidden>

                <IconButton color="primary" onClick={() => this.setState({ drawerOpen: true })}>
                  <MenuIcon />
                </IconButton>

                <Drawer
                  anchor="right"
                  open={this.state.drawerOpen}
                  onClose={() => this.setState({ drawerOpen: false })}
                >
                  <div className={classes.drawerIcon}>
                    <Hidden mdUp>
                      <IconButton onClick={() => this.setState({ drawerOpen: false })}>
                        <MenuIcon />
                      </IconButton>
                    </Hidden>
                  </div>

                  <List >
                    <Hidden mdUp>
                      {desktopRoutes.map(route => this.mapDrawerRoute(route))}
                    </Hidden>
                    {tournamentAdditional.map(route => this.mapDrawerRoute(route))}
                    <Divider />
                    {mode == ApplicationMode.ADMIN && <React.Fragment>
                      {adminRoutes.map(route => this.mapDrawerRoute(route))}
                      <Divider />
                    </React.Fragment>}

                    {mode == ApplicationMode.GUEST && <a>
                      <ListItem button onClick={this.login} >
                        <ListItemIcon>
                          <PowerSettingsNewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Вход" />
                      </ListItem>
                    </a>}

                    {mode != ApplicationMode.GUEST && <React.Fragment>
                      {userRoutes.map(route => this.mapDrawerRoute(route))}
                      <a>
                        <ListItem button onClick={this.logout} >
                          <ListItemIcon>
                            <PowerSettingsNewIcon />
                          </ListItemIcon>
                          <ListItemText primary="Изход" />
                        </ListItem>
                      </a>
                    </React.Fragment>}
                  </List>
                </Drawer>
              </Toolbar>
            </div>
          )}
        </UserService.WithApplicationMode>)}
      </MenuContext.WithCurrentRoute>
    );
  }
}

const styles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    alignItems: 'center'
  },
  toolbar: {
    justifyContent: 'flex-end',
    paddingRight: 0
  },
  drawerIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  list: {
    width: '250px'
  }
});

export default withStyles(styles)(Menu);