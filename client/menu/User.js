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

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    }
  }

  render() {
    const { routes, additionalRoutes } = this.props;

    return (
      <Toolbar className={this.props.classes.root}>
        {/* DESKTOP */}
        <Hidden smDown>
          <Link to="/schedule">
            <Button color="primary" size="large">
              График
            </Button>
          </Link>
          <Link to="/users">
            <Button color="primary" size="large">
              Играчи
            </Button>
          </Link>
          <Button color="primary" size="large" onClick={() => UserService.logout()}>
            Изход
          </Button>
          <IconButton color="primary" onClick={() => this.setState({ drawerOpen: true })}>
            <SettingsIcon />
          </IconButton>
        </Hidden>

        {/* MOBILE */}
        <Hidden mdUp>
          <IconButton color="primary" onClick={() => this.setState({ drawerOpen: true })}>
            <MenuIcon />
          </IconButton>

          <SwipeableDrawer
            anchor="right"
            open={this.state.drawerOpen}
            onClose={() => this.setState({ drawerOpen: false })}
            onOpen={() => this.setState({ drawerOpen: true })}
          >
            <div
              tabIndex={0}
              role="button"
              onClick={() => this.setState({ drawerOpen: false })}
              onKeyDown={() => this.setState({ drawerOpen: false })}
            >
              <List>
                <ListItem button>
                  <Link to="/schedule">
                    <ListItemText primary="График" />
                  </Link>
                </ListItem>
                <ListItem button>
                  <Link to="/users">
                    <ListItemText primary="Играчи" />
                  </Link>
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem button onClick={() => UserService.logout()} >
                  <ListItemText primary="Изход" />
                </ListItem>
              </List>
            </div>
          </SwipeableDrawer>
        </Hidden>
      </Toolbar>
    );
  }
}

export default User;