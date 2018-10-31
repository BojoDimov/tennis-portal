import React from 'react';
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

import UserService from '../services/user.service';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    }
  }

  render() {
    const { routes, additionalRoutes, classes, currentRoute } = this.props;

    return (
      <Toolbar className={classes.root}>
        {/* DESKTOP */}
        <Hidden smDown>
          {routes.map(route => {
            return (
              <Link to={route.to} key={route.id}>
                <Button color="primary" size="large" variant={route.id == currentRoute ? 'outlined' : 'text'}>
                  {route.name}
                </Button>
              </Link>
            );
          })}
          <IconButton color="primary" onClick={() => this.setState({ drawerOpen: true })}>
            <SettingsIcon />
          </IconButton>
        </Hidden>

        {/* MOBILE */}
        <Hidden mdUp>
          <IconButton color="primary" onClick={() => this.setState({ drawerOpen: true })}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Drawer
          anchor="right"
          open={this.state.drawerOpen}
          onClose={() => this.setState({ drawerOpen: false })}
        // onOpen={() => this.setState({ drawerOpen: true })}
        >
          <div
            className={classes.list}
            tabIndex={0}
            role="button"
            onClick={() => this.setState({ drawerOpen: false })}
            onKeyDown={() => this.setState({ drawerOpen: false })}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Hidden mdUp>
                <IconButton onClick={() => this.setState({ drawerOpen: false })}>
                  <MenuIcon />
                </IconButton>
              </Hidden>
            </div>
            <Hidden mdUp >
              <List>
                {routes.map(route => {
                  return (
                    <Link to={route.to} key={route.id}>
                      <ListItem button>
                        {route.Icon && <ListItemIcon>
                          <route.Icon />
                        </ListItemIcon>}
                        <ListItemText primary={route.name} />
                      </ListItem>
                    </Link>
                  );
                })}
              </List>
              <Divider />
            </Hidden>

            <List>
              {additionalRoutes.map(route => {
                return (
                  <Link to={route.to} key={route.id}>
                    <ListItem button>
                      {route.Icon && <ListItemIcon>
                        <route.Icon />
                      </ListItemIcon>}
                      <ListItemText primary={route.name} />
                    </ListItem>
                  </Link>
                );
              })}
              <a>
                <ListItem button>
                  <ListItemIcon>
                    <PowerSettingsNewIcon />
                  </ListItemIcon>
                  <ListItemText primary="Изход" onClick={() => UserService.logout()} />
                </ListItem>
              </a>
            </List>
          </div>
        </Drawer>
      </Toolbar>
    );
  }
}

export default Admin;