import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import ViewQuiltRoundedIcon from '@material-ui/icons/ViewQuiltRounded';
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded';
import PersonIcon from '@material-ui/icons/Person';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import Guest from './Guest';
import Admin from './Admin';

const styles = () => ({
  root: {
    justifyContent: 'flex-end',
    paddingRight: 0
  },
  list: {
    width: '250px'
  }
});

class NavigationModel {
  constructor() {
    this.routes = [
      { id: 1, to: '/schedule', name: 'График' },
      // { id: 2, to: '/players', name: 'Играчи' }
    ];
    this.adminRoutes = [
      { id: 6, to: '/admin/users', name: 'Потребители', Icon: PersonIcon },
      { id: 5, to: '/admin/seasons', name: 'Сезони', Icon: WbSunnyRoundedIcon },
      { id: 4, to: '/admin/courts', name: 'Кортове', Icon: ViewQuiltRoundedIcon },
      { id: 7, to: '/admin/subscriptions', name: 'Абонаменти', Icon: LoyaltyIcon },
      { id: 3, to: '/admin/config', name: 'Настройки', Icon: BuildRoundedIcon }
    ];

    this.Guest = withRoutes(this.routes)(withStyles(styles)(Guest));
    this.User = withRoutes(this.routes, [])(withStyles(styles)(Admin));
    this.Admin = withRoutes(this.routes, this.adminRoutes)(withStyles(styles)(Admin));

    const { Provider, Consumer } = React.createContext(0);
    this.SetCurrentRoute = Provider;
    this.WithCurrentRoute = Consumer;
  }
}

export function withRoutes(routes, additionalRoutes) {
  return (WrappedComponent) => {
    return class extends React.Component {
      render() {
        return <WrappedComponent {...this.props} routes={routes} additionalRoutes={additionalRoutes} />
      }
    }
  }
}

export default new NavigationModel();