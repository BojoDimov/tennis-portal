import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import QueryService from '../services/query.service';
import UserModel from '../users/user.model';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserModel.get(),
      errors: UserModel.getErrorsModel()
    }

    this.handleChange = (prop, custom = false) => (event) => {
      let user = this.state.user;
      user[prop] = (custom ? event : event.target.value);
      this.setState({ user });
    };
  }

  componentDidMount() {
    this.setState({ user: this.props.user });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user != this.props.user && this.props.user)
      this.setState({ user: this.props.user, errors: UserModel.getErrorsModel() });
  }

  save() {
    const model = this.state.user;
    console.log(model);
    if (model.id)
      return QueryService
        .post(`/users/${model.id}`, model)
        .then(_ => this.onSave())
        .catch(err => this.setState({ errors: err }));
    else
      return QueryService
        .post(`/users`, model)
        .then(_ => this.onSave())
        .catch(err => this.setState({ errors: err }));
  }

  render() {
    const { user, errors } = this.state;

    return (
      <div>
        {!user.id && <UserModel.UserAccountData user={user} onChange={this.handleChange} errors={errors} />}
        <UserModel.UserPlayerMainData user={user} onChange={this.handleChange} errors={errors} />
        <UserModel.UserPlayerSecondaryData user={user} onChange={this.handleChange} errors={errors} />

        <div style={{ marginTop: '1rem' }}>
          <Button
            style={{ marginRight: '.3rem' }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => this.save()}
          >
            Запис
           </Button>

          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={this.props.onCancel}
          >
            Отказ
           </Button>

        </div>
      </div>
    );
  }
}

export default EditUser;