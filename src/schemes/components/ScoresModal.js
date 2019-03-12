import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';

import FormModal from '../../components/FormModal';
import QueryService from '../../services/query.service';

class ScoresModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: []
    }

    this.handleChange = (index) => (e) => {
      const scores = this.state.scores;
      scores[index].score = parseInt(e.target.value);
      this.setState({ scores });
    }
  }

  componentDidMount() {
    this.setState({ scores: this.props.scores });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scores != this.props.scores)
      this.setState({ scores: this.props.scores });
  }

  save() {
    return QueryService
      .post(`/schemes/${this.props.scheme.id}/scores/save`, this.props.scores)
      .then(() => this.props.onChange())
  }

  render() {
    const { scores } = this.state;
    const { onClose, onChange, scheme } = this.props;
    const title = `Разпределение на точките за схема ${scheme.name}`;

    const actions = <React.Fragment>
      <Button variant="contained" color="primary" size="small" onClick={() => this.save()}>Запис</Button>
      <Button variant="outlined" color="primary" size="small" onClick={onClose}>Отказ</Button>
    </React.Fragment>

    const body = <List style={{ width: '100%' }}>
      {scores.map(({ team, score }, index) => {
        return (
          <div style={{ display: 'flex', padding: '.5rem 0', borderBottom: '1px solid lightgrey', justifyContent: 'space-between', alignItems: 'center' }} key={index}>
            <div>
              {team.user1 && <Typography>{team.user1.name}</Typography>}
              {team.user2 && <Typography>{team.user2.name}</Typography>}
            </div>
            <input value={score} type="number" style={{ maxWidth: '3em' }} onChange={this.handleChange(index)} />
          </div>
        );
      })}
    </List>

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

export default ScoresModal;