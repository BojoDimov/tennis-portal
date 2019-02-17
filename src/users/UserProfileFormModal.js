import React from 'react';

import FormModal from '../components/FormModal';
import QueryService from '../services/query.service';
import { Button } from '@material-ui/core';

class UserProfileFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {},
      errors: []
    }

    this.handleChange = (prop) => (e) => {
      const model = this.state.model;
      model[prop] = e.target.value;
      this.setState({ model });
    }
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState({ model: this.props.model });
  }

  save() {
    // const model = this.state.model;
    // return QueryService
    //   .post(`/tournaments/${model.id ? model.id : ''}`, model)
    //   .then(e => this.props.onChange(e));
  }

  render() {
    const { model, errors } = this.state;
    const { onClose } = this.props;

    const title = 'Промяна на допълнителна информация за акаунт';
    const actions = <React.Fragment>
      <Button variant="contained" color="primary">Запис</Button>
      <Button variant="contained" color="primary" onClick={onClose}>Отказ</Button>
    </React.Fragment>;

    return (
      <FormModal onClose={onClose} title={title} body={'HIHI'} actions={actions} />
    );
  }
}

export default UserProfileFormModal;