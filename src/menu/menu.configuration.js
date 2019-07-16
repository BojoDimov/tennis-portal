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
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import ViewQuiltRoundedIcon from '@material-ui/icons/ViewQuiltRounded';
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded';
import PersonIcon from '@material-ui/icons/Person';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import UserService from '../services/user.service';
import { ApplicationMode } from '../enums';

export const desktopRoutes = [
  { id: 1, to: '/schedule', name: 'График', Icon: CalendarTodayIcon },
  { id: 2, to: '/editions', name: 'Турнири', faIcon: 'trophy' }
];

export const adminRoutes = [
  { id: 4, to: '/admin/users', name: 'Потребители', Icon: PersonIcon },
  { id: 5, to: '/admin/seasons', name: 'Сезони', Icon: WbSunnyRoundedIcon },
  { id: 6, to: '/admin/courts', name: 'Кортове', Icon: ViewQuiltRoundedIcon },
  { id: 7, to: '/admin/statistics', name: 'Справки', Icon: AssessmentIcon }
];

export const tournamentAdditional = [
  { id: 8, to: '/players', name: 'Играчи', faIcon: 'user-friends' },
  { id: 9, to: '/ranklist', name: 'Ранглисти', faIcon: 'list-ol' },
  { id: 10, to: '/champions', name: 'Шампиони', faIcon: 'medal' },
];

export const userRoutes = [
  { id: 3, to: '/account', name: 'Профил', Icon: PersonIcon }
];

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    }
  }

  mapDrawerRoute(route) {
    return (
      <Link to={route.to} key={route.id}>
        <ListItem button>
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

    const mode = ApplicationMode.ADMIN;
    const currentRoute = 1;

    return (
      <Toolbar className={classes.root} >
        <Hidden smDown>
          {desktopRoutes.map(route => {
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
        <Hidden mdUp>
          <IconButton color="primary" onClick={() => this.setState({ drawerOpen: true })}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Drawer
          anchor="right"
          open={this.state.drawerOpen}
          onClose={() => this.setState({ drawerOpen: false })}
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
              {desktopRoutes.map(route => this.mapDrawerRoute(route))}
            </List>
            <Divider />
          </Hidden>

          <List>
            {adminRoutes.map(route => this.mapDrawerRoute(route))}
            <Divider />
            {tournamentAdditional.map(route => this.mapDrawerRoute(route))}
            <Divider />
            {userRoutes.map(route => this.mapDrawerRoute(route))}
            <a>
              <ListItem button onClick={() => UserService.logout()} >
                <ListItemIcon>
                  <PowerSettingsNewIcon />
                </ListItemIcon>
                <ListItemText primary="Изход" />
              </ListItem>
            </a>
          </List>
        </Drawer>
      </Toolbar>
    );
  }
}

const styles = () => ({
  root: {
    justifyContent: 'flex-end',
    paddingRight: 0
  },
  list: {
    width: '250px'
  }
});

export default withStyles(styles)(Menu);