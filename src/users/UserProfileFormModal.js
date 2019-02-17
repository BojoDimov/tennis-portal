import React from 'react';
import Button from '@material-ui/core/Button';

import FormModal from '../components/FormModal';
import UserModel from './user.model';
import QueryService from '../services/query.service';

class UserProfileFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: UserModel.get(),
      errors: UserModel.getErrorsModel()
    }

    this.handleChange = (prop, custom = false) => (event) => {
      let model = this.state.model;
      model[prop] = (custom ? event : event.target.value);
      this.setState({ model });
    };
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState({ model: this.props.model });
  }

  save() {
    const { model } = this.state;

    return QueryService
      .post('/users/updateSecondaryData', model)
      .then(() => this.props.onChange())
      .catch(err => this.setState({ errors: err }));
  }

  render() {
    const { model, errors } = this.state;
    const { onClose } = this.props;

    const title = 'Промяна на допълнителна информация за акаунт';
    const actions = <React.Fragment>
      <Button variant="contained" color="primary" onClick={() => this.save()}>Запис</Button>
      <Button variant="outlined" color="primary" onClick={onClose}>Отказ</Button>
    </React.Fragment>;
    const body = <UserModel.UserPlayerSecondaryData user={model} onChange={this.handleChange} errors={errors} />

    return (
      <FormModal onClose={onClose} title={title} body={body} actions={actions} />
    );
  }
}

export default UserProfileFormModal;