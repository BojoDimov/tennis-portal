import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import QueryService from '../../services/query.service';
import AsyncSelect from '../../components/select/AsyncSelect';
import FormModal from '../../components/FormModal';

class SelectTeamModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: null,
      user2: null,
      err: null
    };
  }

  save() {
    this.setState({ err: null });

    QueryService
      .post(`/schemes/${this.props.scheme.id}/enrollments`, this.state)
      .then(e => this.props.onChange())
      .catch(err => this.setState({ err }));
  }

  canSave() {
    return (this.props.scheme.singleTeams && this.state.user1)
      || (this.state.user1 && this.state.user2);
  }

  render() {
    const { onClose, scheme } = this.props;
    const { user1, user2, err } = this.state;

    const errTextPrefix = scheme.singleTeams ? "Играчът" : "Някой от играчите";

    const title = 'Записване на играч/двойка';
    const actions = <React.Fragment>
      <Button disabled={!this.canSave()} variant="contained" color="primary" onClick={() => this.save()}>
        Запис
      </Button>
      <Button variant="outlined" color="primary" onClick={onClose}>
        Отказ
      </Button>
    </React.Fragment>;

    const body = <React.Fragment>
      <AsyncSelect
        value={user1}
        label="Избор на играч"
        query="users"
        formatOptionLabel={(option) => <Typography component="span">
          {option.name}
          <Typography component="span" variant="caption">{option.email}</Typography>
        </Typography>}
        onChange={user1 => this.setState({ user1 })} />
      {!scheme.singleTeams && <AsyncSelect
        value={user2}
        label="Избор на играч"
        query="users"
        formatOptionLabel={(option) => <Typography component="span">
          {option.name}
          <Typography component="span" variant="caption">{option.email}</Typography>
        </Typography>}
        onChange={user2 => this.setState({ user2 })} />}

      {err && <div style={{ marginTop: '1rem', color: 'red', fontSize: '.8rem' }}>
        {err.message == 'ExistingEnrollment'
          && <em className="exception">{errTextPrefix} вече са записани.</em>}
        {err.message == 'RequirementsNotMet'
          && <em className="exception">{errTextPrefix} не покрива изискванията на схемата.</em>}
        {err.message == 'UserHasNoInfo'
          && <em className="exception">{errTextPrefix} няма въведена информация за пол и/или дата на раждане.</em>}

      </div>}
    </React.Fragment>;

    return (
      <FormModal
        enableFullWidth={true}
        onClose={onClose}
        title={title}
        body={body}
        actions={actions}
        hasError={err}
      />
    );
  }
}

export default SelectTeamModal;