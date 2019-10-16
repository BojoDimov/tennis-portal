import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment-timezone';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SnowIcon from '../components/icons/SnowIcon';
import PlayersIcon from '../components/icons/PlayersIcon';
import GroupIcon from '../components/icons/GroupIcon';
import BracketIcon from '../components/icons/BracketIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import TournamentIcon from '../components/icons/TournamentIcon';
import QueryService from '../services/query.service';
import { BracketStatus } from '../enums';
import Thumbnail from '../components/ThumbnailOrDefault';

export const SchemeInfoBar = ({ scheme, playerCount, classes }) => {
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

export const RegisterWidget = ({ scheme, refresh, classes }) => {
  let start = moment(scheme.registrationStart);
  let end = moment(scheme.registrationEnd);
  let duration = moment.duration(start.diff(moment()));

  if (moment().isBetween(start, end))
    duration = moment.duration(end.diff(moment()));

  return (
    <ExpansionPanel defaultExpanded>
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

export const SchemesWidget = ({ scheme, classes, history }) => {
  const navigateBracket = () => {
    if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN || scheme.status == BracketStatus.ELIMINATION_END)
      history.push(`/schemes/${scheme.id}/elimination`);
  };

  const navigateGroups = () => {
    if (scheme.bracketStatus != BracketStatus.UNDRAWN)
      history.push(`/schemes/${scheme.id}/groups`);
  };

  return (
    <ExpansionPanel defaultExpanded>
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

export const SingleTeamsFinalMatchWidget = ({ scheme, classes, match }) => {
  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="title">Финал</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.single_teams_finale}>
        <div className="root">
          <div className="player">
            {!match.team1 && <Typography>TBD</Typography>}
            {match.team1 && <React.Fragment>
              <Thumbnail fileId={match.team1.user1.thumbnailId} default="/assets/tennis-player-free-vector.jpg" />
              <div>
                <Typography variant="headline">{match.team1.user1.name}</Typography>
                {match.winnerId && match.winnerId == match.team1Id && <Typography color="primary">Победител</Typography>}
                {match.winnerId && match.winnerId != match.team1Id && <Typography color="primary">Финалист</Typography>}
              </div>
            </React.Fragment>}
          </div>

          <div className="score">
            {match.sets.map(set => {
              return (
                <Typography variant="title" style={{ fontStyle: 'italic' }}>{set.team1} - {set.team2} {set.tiebreaker && <sup>({set.tiebreaker})</sup>}</Typography>
              );
            })}
            {!match.sets.length && <Typography variant="headline" style={{ fontStyle: 'italic' }}>VS</Typography>}
          </div>

          <div className="player">
            {!match.team2 && <Typography>TBD</Typography>}
            {match.team2 && <React.Fragment>
              <Thumbnail fileId={match.team2.user1.thumbnailId} default="/assets/tennis-player-free-vector.jpg" />
              <div>
                <Typography variant="headline">{match.team2.user1.name}</Typography>
                {match.winnerId && match.winnerId == match.team2Id && <Typography color="primary">Победител</Typography>}
                {match.winnerId && match.winnerId != match.team2Id && <Typography color="primary">Финалист</Typography>}
              </div>
            </React.Fragment>}
          </div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export const DoubleTeamsFinalMatchWidget = ({ scheme, classes, match }) => {

}

