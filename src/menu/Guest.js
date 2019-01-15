import React from 'react';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { dispatchEvent } from '../services/events.service';

class Guest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    }
  }

  render() {
    const { routes, classes, currentRoute } = this.props;

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

          <Button color="primary" size="large" onClick={() => dispatchEvent('menu-login')}>
            Вход
          </Button>
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
            style={{ width: '250px' }}
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

              <ListItem button>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Вход" onClick={() => dispatchEvent('menu-login')} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </Toolbar>
    );
  }
}
export default Guest;            