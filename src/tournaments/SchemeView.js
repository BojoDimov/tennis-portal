import React from 'react';
import moment from 'moment-timezone';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import SnowIcon from '../components/icons/SnowIcon';
import PlayersIcon from '../components/icons/PlayersIcon';
import GroupIcon from '../components/icons/GroupIcon';
import BracketIcon from '../components/icons/BracketIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import TournamentIcon from '../components/icons/TournamentIcon';
import { ApplicationMode, BracketStatus } from '../enums';
import { catchEvent } from '../services/events.service';
import EnrollmentsComponent from '../schemes/components/Enrollments';
import SchemeFormModal from '../schemes/SchemeFormModal';
import MessageModal from '../components/MessageModal';
import ScoresModal from '../schemes/components/ScoresModal';
import EliminationPreviewModal from '../schemes/components/EliminationPreviewModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

class SchemeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: {
        edition: {
          tournament: {}
        }
      },
      schemeModel: null,
      enrolled: [],
      hasError: false,
      scores: null,
      eliminationPreview: null
    }
  }

  render() {
    const { scheme, schemeModel, enrolled, scores, eliminationPreview } = this.state;
    const { classes, history } = this.props;

    return (
      <UserService.WithApplicationMode>
        {mode => {
          let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

          return (
            <div className="container">
              <MessageModal activation={this.state.hasError}>
                <Typography>Неуспешно изтриване на схема. Възможна причина за грешката е съществуващи записи на играчи.</Typography>
              </MessageModal>
              {hasPermission && schemeModel
                && <SchemeFormModal
                  model={schemeModel}
                  onChange={() => {
                    this.setState({ schemeModel: null });
                    this.getData();
                  }}
                  onClose={() => this.setState({ schemeModel: null })}
                />}
              {scores && scores.length > 0
                && <ScoresModal
                  scores={scores}
                  scheme={scheme}
                  onChange={() => {
                    this.setState({ scores: null });
                    this.getData();
                  }}
                  onClose={() => this.setState({ scores: null })}
                />}

              {eliminationPreview && <EliminationPreviewModal
                teams={eliminationPreview}
                scheme={scheme}
                onClose={() => this.setState({ eliminationPreview: null })}
                onDraw={() => this.setState({ eliminationPreview: null }, this.getData())}
              />}

              {hasPermission && this.getButtons()}


              <Paper className={classes.root}>
                <Typography className={classes.heading}>{scheme.name}</Typography>
                <SchemeInfoBar scheme={scheme} playerCount={enrolled.length} classes={classes} />
                <Typography style={{ marginBottom: '1em' }}>{scheme.info}</Typography>
                <div className={classes.widgets_root}>
                  <div style={{ flexBasis: '100%', marginBottom: '2em' }}>
                    <FinalMatchWidget scheme={scheme} classes={classes} />
                  </div>
                  <div style={{ flexBasis: '50%', marginRight: '1em' }}>
                    <RegisterWidget scheme={scheme} refresh={() => this.getData()} classes={classes} />
                    <SchemesWidget scheme={scheme} classes={classes} history={history} />
                  </div>
                  <div style={{ flexGrow: 1, marginLeft: '1em' }}>
                    <EnrollmentsComponent scheme={scheme} mode={mode} />
                  </div>
                </div>
              </Paper>
            </div>
          );
        }}
      </UserService.WithApplicationMode>
    );
  }

  componentDidMount() {
    this.getData();
    catchEvent('logged-in', () => {
      this.getData();
    })
  }

  getData() {
    const { id } = this.props.match.params;

    QueryService
      .get(`/schemes/${id}`)
      .then(e => this.setState({ scheme: e }));

    QueryService
      .get(`/schemes/${id}/enrollments`)
      .then(enrolled => this.setState({ enrolled }));
  }

  deleteScheme() {
    this.setState({ hasError: false });
    return QueryService.delete(`/schemes/${this.state.scheme.id}`)
      .then(e => this.props.history.replace(`/editions/${this.state.scheme.edition.id}`))
      .catch(err => this.setState({ hasError: true }));
  }

  getScores() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/scores`)
      .then(scores => this.setState({ scores }));
  }

  previewElimination() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/draw/eliminationPhase/preview`)
      .then(eliminationPreview => this.setState({ eliminationPreview }));
  }

  drawGroupPhase() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/draw/groupPhase`)
      .then(() => this.getData());
  }

  finishPhase() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/draw/finish`)
      .then(() => this.getData());
  }

  getButtons() {
    const { scheme } = this.state;

    return (
      <div style={{ margin: '.5rem 0' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => this.setState({ schemeModel: scheme })}
        >
          Промяна
        </Button>

        {scheme.bracketStatus == BracketStatus.UNDRAWN
          && <ConfirmationDialog
            title="Изтриване на турнир"
            body={<Typography>Сигурни ли сте че искате да изтриете схема {scheme.name}?</Typography>}
            onAccept={() => this.deleteScheme()}
          >
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginLeft: '.3rem' }}
            >
              Изтриване
                  </Button>
          </ConfirmationDialog>}

        {((scheme.bracketStatus == BracketStatus.UNDRAWN && !scheme.hasGroupPhase)
          || (scheme.bracketStatus == BracketStatus.GROUPS_END))
          && <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: '.3rem' }}
            onClick={() => this.previewElimination()}
          >
            Изтегляне
        </Button>}

        {scheme.bracketStatus == BracketStatus.UNDRAWN && scheme.hasGroupPhase
          && <ConfirmationDialog
            title="Изтегляне на схема"
            body={<Typography>Сигурни ли сте, че искате да изтеглите схемата?</Typography>}
            onAccept={() => this.drawGroupPhase()}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: '.3rem' }}
            >
              Изтегляне
            </Button>
          </ConfirmationDialog>}

        {(scheme.bracketStatus == BracketStatus.GROUPS_DRAWN || scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN)
          && <ConfirmationDialog
            title="Приключване на фаза"
            body={<Typography>Сигурни ли сте че искате да приключите текущата фаза?</Typography>}
            onAccept={() => this.finishPhase()}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: '.3rem' }}
            >
              Приключване на фаза
            </Button>
          </ConfirmationDialog>}

        {scheme.bracketStatus == BracketStatus.ELIMINATION_END
          && <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: '.3rem' }}
            onClick={() => this.getScores()}
          >
            Резултати
          </Button>}
      </div>
    );
  }
}

const SchemeInfoBar = ({ scheme, playerCount, classes }) => {
  return (
    <div className={classes.info_bar_root}>
      <Typography color="primary">
        <SnowIcon width="25px" height="25px" />
        {scheme.edition.tournament.name}
      </Typography>
      <Typography color="primary">
        <PlayersIcon width="25px" height="25px" />
        <b style={{ margin: '0 .3em' }}>{playerCount || 0}</b>
        Участника (макс. {scheme.maxPlayerCount})
      </Typography>

      <Typography color="primary">
        <TournamentIcon width="25px" height="25px" />
        {scheme.singleTeams && "SGL "}
        {!scheme.singleTeams && "DBL "}
        ({scheme.hasGroupPhase && "Групи ->"}Дир.ел.)
      </Typography>

      <Typography color="primary">
        <CalendarIcon width="25px" height="25px" />
        {moment(scheme.date).format('DD.MM.YYYY  HH:mm')}
      </Typography>
    </div>
  );
}

const RegisterWidget = ({ scheme, refresh, classes }) => {
  let start = moment(scheme.registrationStart);
  let end = moment(scheme.registrationEnd);
  let duration = moment.duration(start.diff(moment()));

  if (moment().isBetween(start, end))
    duration = moment.duration(end.diff(moment()));

  return (
    <ExpansionPanel defaultExpanded style={{ flexBasis: '40%' }}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="title">Записване</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.register_widget}>
        {moment().isBefore(start) && <React.Fragment>
          <Typography>Остават <b>{duration.days()} дни, {duration.hours()} часа</b> и <b> {duration.minutes()} минути</b> до началото на записването.</Typography>
          <div className="buttons">
            <Button variant="contained" color="primary" disabled>Записване</Button>
          </div>
        </React.Fragment>}

        {moment().isBetween(start, end) && <React.Fragment>
          <Typography>Остават <b>{duration.days()} дни, {duration.hours()} часа</b> и <b> {duration.minutes()} минути</b> до края на записването.</Typography>
          <div className="buttons">
            <Button variant="contained" color="primary">Записване</Button>
          </div>
        </React.Fragment>}

        {moment().isAfter(end) && <React.Fragment>
          <Typography>Записването за този турнир е приключило.</Typography>
        </React.Fragment>}


      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

const SchemesWidget = ({ scheme, classes, history }) => {
  const navigateBracket = () => {
    if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN || scheme.status == BracketStatus.ELIMINATION_END)
      history.push(`/schemes/${scheme.id}/elimination`);
  };

  const navigateGroups = () => {
    if (scheme.bracketStatus != BracketStatus.UNDRAWN)
      history.push(`/schemes/${scheme.id}/groups`);
  };

  return (
    <ExpansionPanel defaultExpanded style={{ flexBasis: '40%' }}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="title">Схема</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.schemes_widget}>
        {scheme.hasGroupPhase && <Paper elevation={1} className={classes.schemes_widget_tile} onClick={navigateGroups}>
          <GroupIcon width="100px" height="100px" />
          <Typography>Групи</Typography>
        </Paper>}

        <Paper elevation={1} className={classes.schemes_widget_tile} onClick={navigateBracket}>
          <BracketIcon width="100px" height="100px" />
          <Typography>Преглед</Typography>
        </Paper>

      </ExpansionPanelDetails >
    </ExpansionPanel >
  );
}

const FinalMatchWidget = ({ scheme, classes }) => {
  if (!scheme || !scheme.matches || !scheme.matches.length || scheme.bracketRounds != scheme.matches[0].round)
    return null;

  let match = scheme.matches[0];

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="title">Финал</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Typography style={{ margin: '0 2em' }}>
            {match.team1 ? match.team1.user1.name : 'TBD'}
            {match.winnerId && match.winnerId == match.team1Id && <Typography color="primary">Победител</Typography>}
            {match.winnerId && match.winnerId != match.team1Id && <Typography color="primary">Финалист</Typography>}
          </Typography>
          <div>
            {match.sets.map(set => {
              return (
                <Typography>{set.team1} - {set.team2} {set.tiebreaker && <sup>({set.tiebreaker})</sup>}</Typography>
              );
            })}
          </div>

          <Typography style={{ margin: '0 2em' }}>
            {match.team2 ? match.team2.user1.name : 'TBD'}
            {match.winnerId && match.winnerId == match.team2Id && <Typography color="primary">Победител</Typography>}
            {match.winnerId && match.winnerId != match.team2Id && <Typography color="primary">Финалист</Typography>}
          </Typography>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

const styles = (theme) => ({
  root: {
    padding: '2em'
  },
  heading: {
    fontWeight: 700,
    fontSize: '1.3em'
  },
  info_bar_root: {
    display: 'flex',
    justifyContent: 'flex-start',
    color: theme.palette.primary.light,
    marginBottom: '1em',
    '& > *': {
      color: theme.palette.primary.light,
      fontWeight: 600,
      marginRight: '.5em',
      display: 'flex',
      alignItems: 'center'
    }
  },
  widgets_root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  schemes_widget: {
    display: 'flex',
    padding: '2em',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  schemes_widget_tile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.3em 1em',
    background: 'linear-gradient(0deg, rgb(255, 232, 217) 0%, rgb(255, 255, 255) 100%)',
    color: theme.palette.secondary.main,
    cursor: 'pointer'
  },
  register_widget: {
    display: 'flex',
    flexDirection: 'column',
    padding: '.5em 1.5em',
    '& .buttons': {
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }
  }
});

export default withStyles(styles)(SchemeView);