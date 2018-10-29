import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import BuildIcon from '@material-ui/icons/Build';

import QueryService from '../services/query.service';
import { getHour } from '../utils';

class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSeason: {
        subscriptions: []
      },
      history: null,
      historyOpen: false,
      editSubscription: null
    };
  }

  componentDidMount() {
    this.load();
  }

  load() {
    return QueryService
      .get(`/subscriptions`)
      .then(currentSeason => this.setState({ currentSeason }));
  }

  loadHistory() {
    return QueryService
      .get(`/subscriptions/history`)
      .then(history => this.setState({ history }));
  }

  handleHistoryClick() {
    const { history, historyOpen } = this.state;
    if (!historyOpen)
      this.setState({ historyOpen: !historyOpen });

    if (!historyOpen && !history)
      this.loadHistory();
  }

  prepareForEdit(subscription) {
    subscription.season = this.state.currentSeason;
    return subscription;
  }

  newSubscription() {
    return {
      hour: '',
      courtId: '',
      court: {},
      seasonId: '',
      season: this.state.currentSeason,
      userId: '',
      user: {}
    }
  }

  remove(index) {
    const subs = this.state.currentSeason.subscriptions[index];
    return QueryService
      .delete(`/subscriptions/${subs.id}`)
      .then(_ => {
        const currentSeason = this.state.currentSeason;
        currentSeason.subscriptions.splice(index, 1);
        this.setState({ currentSeason });
      })
      .catch(err => console.log('ERR: ', err));
  }

  render() {
    const { currentSeason, history, editSubscription } = this.state;
    console.log(editSubscription);
    return (
      <div style={{ margin: '1rem' }}>
        <Paper style={{ marginBottom: '1rem', padding: '1rem' }}>
          <Typography variant="headline" align="center" >Абонаменти</Typography>
          <Button variant="contained" color="primary" onClick={() => this.setState({ editSubscription: this.newSubscription() })}>
            Нов абонамент
          </Button>

          {editSubscription && <EditSubscription
            model={editSubscription}
            onSave={() => this.load()}
            onCancel={() => this.setState({ editSubscription: null })}
          />}
        </Paper>

        <Paper style={{ marginBottom: '1rem', padding: '1rem' }}>
          <Typography variant="title">Текущи абонаменти - <em>{currentSeason.name}</em></Typography>
          <Table padding="none">
            <TableHead>
              <TableRow>
                <TableCell>Име</TableCell>
                <TableCell>Корт</TableCell>
                <TableCell>Час</TableCell>
                <TableCell>Неизиграни часове</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentSeason.subscriptions.map((subscription, index) => {
                return (
                  <TableRow key={subscription.id}>
                    <TableCell>{subscription.user.name}</TableCell>
                    <TableCell>{subscription.court.name}</TableCell>
                    <TableCell>{getHour(subscription.hour)} - {getHour(subscription.hour + 1)}</TableCell>
                    <TableCell>{subscription.unplayedHours}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => this.setState({ editSubscription: this.prepareForEdit(subscription) })}
                      >
                        <BuildIcon />
                      </Button>

                      <Button
                        variant="text"
                        color="secondary"
                        size="small"
                        onClick={() => this.remove(index)}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={() => this.handleHistoryClick()}>
            <Typography variant="title">История</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {!history && <Typography variant="caption">Loading...</Typography>}
            {history && history.length == 0 && <Typography variant="caption">Няма предишни сезони</Typography>}
            {history && history.map(season => {
              return (
                <div key={season.id}>
                  <Typography variant="title">{season.name}</Typography>
                  <Table padding="none">
                    <TableHead>
                      <TableRow>
                        <TableCell>Име</TableCell>
                        <TableCell>Корт</TableCell>
                        <TableCell>Час</TableCell>
                        <TableCell>Неизиграни часове</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {season.subscriptions.map(subscription => {
                        return (
                          <TableRow key={subscription.id}>
                            <TableCell>{subscription.user.name}</TableCell>
                            <TableCell>{subscription.court.name}</TableCell>
                            <TableCell>{getHour(subscription.hour)} - {getHour(subscription.hour + 1)}</TableCell>
                            <TableCell>{subscription.unplayedHours}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

class EditSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      hour: '',
      courtId: '',
      court: {},
      seasonId: '',
      season: {},
      userId: '',
      user: {}
    }
  }

  componentDidMount() {
    this.setState(this.props.model);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState(this.props.model);
  }

  save() {
    if (this.state.id)
      return QueryService
        .post(`/subscriptions/${this.state.id}`, this.state)
        .then(_ => this.props.onSave())
        .catch(err => console.log('ERR:', err));
    else
      return QueryService
        .post(`/subscriptions`, this.state)
        .then(_ => this.props.onSave())
        .catch(err => console.log('ERR:', err));
  }

  cancel() {
    this.props.onCancel();
  }

  render() {
    const model = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption">
          Сезон
        <Typography>{model.season.name}</Typography>
        </Typography>
        <TextField
          label="Час"
          value={model.hour}
          onChange={e => this.setState({ hour: e.target.value })}
          fullWidth={true}
        />

        <TextField
          label="Корт"
          value="Корт 1"
          onChange={e => this.setState({ courtId: e.target.value })}
          fullWidth={true}
        />

        <TextField
          label="Потребител"
          value="Scra"
          onChange={e => this.setState({ userId: e.target.value })}
          fullWidth={true}
        />

        <div>
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
        </div>
      </div>
    );
  }
}

export default Subscriptions;