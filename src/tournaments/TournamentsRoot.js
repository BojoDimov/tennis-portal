import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Link, Route } from 'react-router-dom';

import TournamentView from './TournamentView';
import TournamentFormModal from './TournamentFormModal';
import ImageField from '../components/ImageField';
import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import { ApplicationMode, Status } from '../enums';

class TournamentsRouting extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/leagues/:id" component={TournamentView} />
        <Route path="/leagues" render={() => {
          return (
            <UserService.WithApplicationMode>
              {mode => <TournamentsRoot {...this.props} mode={mode} />}
            </UserService.WithApplicationMode>
          );
        }} />
      </Switch>
    );
  }
}

class TournamentsRoot extends React.Component {
  constructor() {
    super();
    this.state = {
      tournaments: [],
      tournamentModel: null
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService
      .post('/tournaments/filter', {})
      .then(tournaments => this.setState({ tournaments }));
  }

  openTournamentModal(model) {
    if (!model)
      this.setState({
        tournamentModel: {
          status: Status.DRAFT
        }
      });
    else
      this.setState({ tournamentModel: JSON.parse(JSON.stringify(model)) })
  }

  render() {
    const { classes, mode } = this.props;
    const { tournaments, tournamentModel } = this.state;

    return (
      <div className="container">
        {tournamentModel
          && <TournamentFormModal
            model={tournamentModel}
            onChange={() => { this.setState({ tournamentModel: null }); this.getData(); }}
            onClose={() => this.setState({ tournamentModel: null })}
          />}

        <div style={{ margin: '.5rem 0' }}>
          {(mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT)
            && <Button variant="contained" size="medium" color="primary" onClick={() => this.openTournamentModal()} >Нова лига</Button>}
        </div>
        <div className={classes.previewContainer}>
          {tournaments.map(tournament => <TournamentPreview key={tournament.id} classes={classes} tournament={tournament} mode={mode} onEdit={model => this.openTournamentModal(model)} />)}
        </div>
      </div>
    );
  }
}

class TournamentPreview extends React.Component {
  edit() {
    this.props.onEdit(this.props.tournament);
  }

  render() {
    const { tournament, classes, mode } = this.props;

    return (
      <Paper className={classes.previewRoot} elevation={5}>
        {tournament.thumbnailId && <img src={QueryService.getFileUrl(tournament.thumbnailId)} className={classes.previewImage} />}
        <Typography variant="h4" className={classes.previewBodyPart}>{tournament.name}</Typography>
        <Typography variant="caption" className={classes.previewBodyPart}>{tournament.info}</Typography>
        {(mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT)
          && <Button variant="text" size="small" color="primary" onClick={() => this.edit()}>Промяна</Button>}
      </Paper>
    );
  }
}

const styles = (theme) => ({
  previewContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  previewRoot: {
    margin: '.5rem .5rem 0 0',
    width: '32.5%',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: '49%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  previewImage: {
    width: '100%',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    '&:hover': {
      opacity: .9
    }
  },
  previewBodyPart: {
    padding: '0.5rem'
  }
});

export default withStyles(styles)(TournamentsRouting);