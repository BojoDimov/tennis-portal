import React from 'react';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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

        <SwipeableDrawer
          anchor="right"
          open={this.state.drawerOpen}
          onClose={() => this.setState({ drawerOpen: false })}
          onOpen={() => this.setState({ drawerOpen: true })}
        >
          <div
            style={{ width: '250px' }}
            tabIndex={0}
            role="button"
            onClick={() => this.setState({ drawerOpen: false })}
            onKeyDown={() => this.setState({ drawerOpen: false })}
          >
            <List>
              {routes.map(route => {
                return (
                  <ListItem key={route.id} button>
                    <Link to={route.to}>
                      <ListItemText primary={route.name} />
                    </Link>
                  </ListItem>
                );
              })}
              <ListItem button>
                <ListItemText primary="Вход" onClick={() => dispatchEvent('menu-login')} />
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </Toolbar>
    );
  }
}

export default Guest;