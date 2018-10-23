import React from 'react';

import NavigationModel from './navigation.model';
import UserService from '../services/user.service';
import { ApplicationMode } from '../enums';

class Navigation extends React.Component {
  render() {
    return (
      <UserService.WithApplicationMode>
        {mode => <NavigationModel.WithCurrentRoute>
          {currentRoute => <div className="container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <img src="assets/logo3.png" />
            {mode == ApplicationMode.GUEST && <NavigationModel.Guest currentRoute={currentRoute} />}
            {mode == ApplicationMode.USER && <NavigationModel.User currentRoute={currentRoute} />}
            {mode == ApplicationMode.ADMIN && <NavigationModel.Admin currentRoute={currentRoute} />}
          </div>}
        </NavigationModel.WithCurrentRoute>}
      </UserService.WithApplicationMode>
    );
  }
}

export default Navigation;