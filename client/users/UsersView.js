import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import UserModel from '../models/user.model';

class UsersView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      isAdmin: UserService.isAdmin(),
      user: UserModel.get()
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    QueryService
      .get(`/users/${this.props.match.params.id}`)
      .then(e => this.setState({ user: e }));
  }

  render() {
    return (
      <div className="container">
        <Card>
          Coming soon users view
      </Card>
      </div>
    );
  }
}

export default UsersView;