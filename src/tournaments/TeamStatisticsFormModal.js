import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import FormModal from '../components/FormModal';
import QueryService from '../services/query.service';

class TeamStatisticsFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: {}
    }

    this.handleUpdate = (field) => (e) => {
      let state = this.state;
      state[field] = e.target.value;
      this.setState(state);
    };
  }

  componentDidMount() {
    this.setState(this.props.team);
  }

  componentDidUpdate(previousProps) {
    if (previousProps.team != this.props.team)
      this.setState(this.props.team);
  }

  save() {
    return QueryService.post(`/teams/${this.state.id}`, this.state)
      .then(res => this.props.onUpdate());
  }

  render() {
    const handleUpdate = this.handleUpdate;
    const { user1, user2, wonMatches, wonTournaments, totalMatches, totalTournaments } = this.state;
    const { onClose } = this.props;

    const title = `Промяна на статистиката за ${user2 ? `отбор ${user1.name} & ${user2.name}` : `играч ${user1.name}`}`;

    const actions = <React.Fragment>
      <Button variant="contained" color="primary" size="small" onClick={() => this.save()}>
        Запис
      </Button>
      <Button variant="outlined" color="primary" size="small" onClick={onClose}>Отказ</Button>
    </React.Fragment>;

    const body = <div>
      <TextField
        fullWidth
        label="Спечелени мачове"
        type="number"
        value={wonMatches}
        onChange={handleUpdate('wonMatches')}
      />

      <TextField
        fullWidth
        label="Общо изиграни мачове"
        type="number"
        value={totalMatches}
        onChange={handleUpdate('totalMatches')}
      />

      <TextField
        fullWidth
        label="Спечелени турнири"
        type="number"
        value={wonTournaments}
        onChange={handleUpdate('wonTournaments')}
      />

      <TextField
        fullWidth
        label="Общо изиграни турнири"
        type="number"
        value={totalTournaments}
        onChange={handleUpdate('totalTournaments')}
      />
    </div>;

    return (
      <FormModal
        enableFullWidth={true}
        onClose={onClose}
        title={title}
        body={body}
        actions={actions}
      />
    );
  }
}

export default TeamStatisticsFormModal;