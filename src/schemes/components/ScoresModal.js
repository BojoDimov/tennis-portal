import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormModal from '../../components/FormModal';
import QueryService from '../../services/query.service';

class ScoresModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: []
    }

    this.handleChange = (index, prop) => (e) => {
      const scores = this.state.scores;
      if (prop != 'isWinner')
        scores[index][prop] = parseInt(e.target.value);
      else
        scores[index].isWinner = e.target.value === 'true';

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

  getTeamView(model, index) {
    return (
      <React.Fragment key={model.team.id}>
        <ListItem style={{ display: 'flex', }}>
          <div style={{ display: 'flex', flexBasis: '35%' }}>
            {model.team.user1 && <Typography>{model.team.user1.name}</Typography>}
            {model.team.user2 && <Typography>{model.team.user2.name}</Typography>}
          </div>
          <div style={{ display: 'flex', flexBasis: '65%' }}>
            <TextField type="number" value={model.score} onChange={this.handleChange(index, 'score')} label="Точки" />
            <TextField type="number" value={model.wonMatches} onChange={this.handleChange(index, 'wonMatches')} label="Спечелени мачове" />
            <TextField type="number" value={model.totalMatches} onChange={this.handleChange(index, 'totalMatches')} label="Общо мачове" />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={model.isWinner}
                  value={!model.isWinner + ''}
                  onChange={this.handleChange(index, 'isWinner')}
                />
              }
              label="Победител"
            />
          </div>
        </ListItem>
        <Divider />
      </React.Fragment>
    );
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
      {scores.map((model, index) => this.getTeamView(model, index))}
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