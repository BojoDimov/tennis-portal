import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import { getHour } from '../utils';

const styles = () => ({
  card: {
    width: '250px',
    margin: '1rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  cardContent: {
    paddingBottom: '0'
  }
});

class SeasonItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'view'
    }
  }

  componentDidMount() {
    if (!this.props.season.id)
      this.setState({ mode: 'create' });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.season != this.props.season)
      if (!this.props.season.id)
        this.setState({ mode: 'create' });
  }

  handleCancel() {
    if (this.state.mode == 'edit')
      this.setState({ mode: 'view' });
    else this.props.onCreateCancel();
  }

  render() {
    const { mode } = this.state;
    const { classes, season } = this.props;

    if (mode != 'view')
      return <SeasonEdit
        mode={mode}
        season={season}
        onChange={model => {
          this.setState({ mode: 'view' });
          this.props.onChange(model);
        }}
        onCancel={() => this.handleCancel()}
      />;
    else
      return (
        <Card classes={{ root: classes.card }}>
          <CardContent classes={{ root: classes.cardContent }}>
            <Typography variant="title" style={{ display: 'flex', alignItems: 'center' }}>
              {season.name}
            </Typography>
            <Typography variant="caption">{season.info}</Typography>
            <Typography variant="subheading" style={{ paddingRight: '1rem' }}>
              Работно време:
              <Typography>{getHour(season.workingHoursStart)} - {getHour(season.workingHoursEnd)}</Typography>
            </Typography>
          </CardContent>
          <CardActions classes={{ root: classes.cardActions }}>
            <Button variant="contained" color="primary" size="small" onClick={() => this.setState({ mode: 'edit' })}>Промяна</Button>
          </CardActions>
        </Card >
      );
  }
}

class SeasonEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      name: '',
      info: '',
      isActive: true,
      workingHoursStart: '',
      workingHoursEnd: ''
    }
  }

  componentDidMount() {
    this.setState(this.props.season);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.season != this.props.season)
      this.setState(this.props.season);
  }

  cancel() {
    this.setState(this.props.season);
    this.props.onCancel();
  }

  save() {
    if (this.state.id)
      return QueryService
        .post(`/schedule/courts/${this.state.id}`, this.state)
        .then(e => this.props.onChange(e))
        .catch(err => console.log('ERR:', err));
    else
      return QueryService
        .post(`/schedule/courts`, this.state)
        .then(e => this.props.onChange(e))
        .catch(err => console.log('ERR:', err));
  }

  render() {
    const { mode } = this.props;

    return (
      <Paper style={{ flexBasis: '250px', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        {mode == 'create' && <Typography align="center" variant="headline">Нов сезон</Typography>}
        {mode == 'edit' && <Typography align="center" variant="headline">Промяна на сезон</Typography>}

        <TextField
          id="name"
          label="Наименование"
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
        />
        <TextField
          id="info"
          label="Информация"
          multiline
          rowsMax="4"
          value={this.state.info}
          onChange={(e) => this.setState({ info: e.target.value })}
        />

        <TextField
          id="workingHoursStart"
          label="Работно време ОТ"
          type="number"
          value={this.state.workingHoursStart}
          onChange={(e) => this.setState({ workingHoursStart: e.target.value })}
        />

        <TextField
          id="workingHoursEnd"
          label="Работно време ДО"
          type="number"
          value={this.state.workingHoursEnd}
          onChange={(e) => this.setState({ workingHoursEnd: e.target.value })}
        />

        {this.props.mode == 'create' && <div style={{ margin: '1rem 0 0 0' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ margin: '.5rem .5rem 0 0' }}
            onClick={() => this.save()}
          >
            Създаване
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ margin: '.5rem 0 0 0' }}
            onClick={() => this.cancel()}
          >
            Отказ
          </Button>
        </div>}

        {this.props.mode == 'edit' && <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ margin: '.5rem .5rem 0 0' }}
            onClick={() => this.save()}
          >
            Запис
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ margin: '.5rem 0 0 0' }}
            onClick={() => this.cancel()}
          >
            Отказ
          </Button>
        </div>}
      </Paper>
    );
  }
}

export default withStyles(styles)(SeasonItem);