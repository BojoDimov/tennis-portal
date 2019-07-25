import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Link, Route } from 'react-router-dom';

import TournamentView from './TournamentView';
import TournamentFormModal from './TournamentFormModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import { ApplicationMode, Status } from '../enums';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
    };
  }

  refresh() {
    this.setState({ tournamentModel: null });
    this.getData();
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

  removeTournament(tournament) {
    if (!tournament)
      return;

    return QueryService.delete(`/tournaments/${tournament.id}`)
      .then(() => this.getData());
  }

  render() {
    const { classes, mode } = this.props;
    const { tournaments, tournamentModel } = this.state;

    return (
      <div className="container">
        {tournamentModel
          && <TournamentFormModal
            model={tournamentModel}
            onChange={() => this.refresh()}
            onClose={() => this.setState({ tournamentModel: null })}
          />}

        <div style={{ margin: '0 .5rem' }}>
          <div>
            {(mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT)
              && <Button variant="contained" size="medium" color="primary" onClick={() => this.openTournamentModal()} >Нова лига</Button>}
          </div>
          <div className={classes.previewContainer}>
            {tournaments.map(tournament => <TournamentPreview
              {...this.props}
              key={tournament.id}
              tournament={tournament}
              mode={mode}
              onEdit={model => this.openTournamentModal(model)}
              onRemove={tournament => this.removeTournament(tournament)}
            />)}
          </div>
        </div>
      </div>
    );
  }
}

class TournamentPreview extends React.Component {
  edit(e) {
    e.stopPropagation();
    this.props.onEdit(this.props.tournament);
  }

  remove() {
    this.props.onRemove(this.props.tournament);
  }

  navigate() {
    this.props.history.push(`/tournaments/${this.props.tournament.id}`);
  }

  render() {
    const { tournament, classes, mode } = this.props;

    return (
      <Paper className={classes.previewRoot} elevation={5} onClick={() => this.navigate()}>
        {tournament.thumbnailId && <img src={QueryService.getFileUrl(tournament.thumbnailId)} className={classes.previewImage} />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" className={classes.previewBodyPart}>
            {tournament.name}
          </Typography>
          {tournament.status == Status.DRAFT && <Typography className={classes.draftLabel}>чернова</Typography>}
        </div>
        <Typography variant="caption" className={classes.previewBodyPart} style={{ flexGrow: 2 }}>{tournament.info}</Typography>

        {(mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT)
          && <div className={classes.previewBodyPart}>
            <Button variant="text" size="small" color="primary" onClick={(e) => this.edit(e)}>Промяна</Button>

            <ConfirmationDialog
              title="Изтриване на лига"
              body={<Typography>Сигурни ли сте че искате да изтриете лигата {tournament.name}?</Typography>}
              onAccept={() => this.remove()}
            >
              <Button variant="text" size="small" color="secondary">Изтриване</Button>
            </ConfirmationDialog>
          </div>}
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
    margin: '.5rem 0 0 0',
    width: '32%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      width: '49%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  draftLabel: {
    borderRadius: '4px',
    backgroundColor: '#3e3e3e',
    color: 'white',
    padding: '.2rem .5rem',
    margin: '0 1rem 0 0',
    fontSize: '.8rem'
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