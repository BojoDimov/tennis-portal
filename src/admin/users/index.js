import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { UserSearchComponent } from './UserSearch';
import { UserEditComponent } from './UserEdit';
import { UserViewComponent } from './UserView';
import { get } from '../../services/fetch';

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  getData() {
    return get('/user-edit/')
      .then(e => this.setState({ users: e }));
  }

  componentDidMount() {
    return this.getData();
  }

  render() {
    return (
      <Switch>
        <Route path='/users/:id/edit' render={(props) => <UserEditComponent onChange={() => this.getData()} {...props} />} />
        <Route path='/users/:id' render={(props) => <UserViewComponent onChange={() => this.getData()} {...props} />} />
        <Route render={(props) =>
          <UserSearchComponent
            users={this.state.users}
            onChange={() => this.getData()}
            {...props}
          />
        } />
      </Switch>
    )
  }
}