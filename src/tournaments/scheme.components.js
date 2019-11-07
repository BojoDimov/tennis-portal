import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment-timezone';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlayersIcon from '../components/icons/PlayersIcon';
import GroupIcon from '../components/icons/GroupIcon';
import BracketIcon from '../components/icons/BracketIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import TournamentIcon from '../components/icons/TournamentIcon';
import EditBoxedIcon from '../components/icons/EditBoxedIcon';
import WinnerIcon from '../components/icons/WinnerIcon';
import SeasonIcon from '../components/SeasonIcon';
import QueryService from '../services/query.service';
import EnrollmentsComponent from '../schemes/components/Enrollments';
import { BracketStatus, ApplicationMode } from '../enums';
import Thumbnail from '../components/ThumbnailOrDefault';
import ConfirmationDialog from '../components/ConfirmationDialog';

export const SchemeInfoBar = ({ scheme, playerCount, classes }) => {
  return (
    <div className={classes.info_bar_root}>
      <Typography color="primary">
        {/* <SnowIcon width="25px" height="25px" /> */}
        <SeasonIcon date={scheme.date} />
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

export const RegisterWidget = (props) => {
  const { scheme, classes, invitationTrigger, enrollment, mode, onComplete, onError } = props;
  console.log(enrollment);
  let start = moment(scheme.registrationStart);
  let end = moment(scheme.registrationEnd);
  let duration = moment.duration(start.diff(moment()));

  if (moment().isBetween(start, end))
    duration = moment.duration(end.diff(moment()));

  let enroll = () => dispatchEvent('menu-login');
  if (mode != ApplicationMode.GUEST)
    enroll = invitationTrigger || (() => QueryService
      .get(`/schemes/${scheme.id}/enrollments/enroll`)
      .then(onComplete('enroll'))
      .catch(onError('enroll')));

  const cancelEnroll = () => {
    return QueryService
      .delete(`/schemes/${scheme.id}/enrollments/${enrollment.id}/cancelEnroll`)
      .then(onComplete('cancel'))
      .catch(onError('cancel'));
  }

  let Body = (
    <React.Fragment>
      {moment().isBefore(start) && <React.Fragment>
        <Typography>Остават <b>{duration.days()} дни, {duration.hours()} часа</b> и <b> {duration.minutes()} минути</b> до началото на записването.</Typography>
        <div className="buttons">
          <Button variant="contained" color="primary" disabled>
            <EditBoxedIcon width="1em" height="1em" style={{ marginRight: '.3em' }} />
            Записване
          </Button>
        </div>
      </React.Fragment>}

      {moment().isBetween(start, end) && <React.Fragment>
        <Typography>Остават <b>{duration.days()} дни, {duration.hours()} часа</b> и <b> {duration.minutes()} минути</b> до края на записването.</Typography>
        <div className="buttons">
          <Button variant="contained" color="primary" onClick={enroll}>
            <EditBoxedIcon width="1em" height="1em" style={{ marginRight: '.3em' }} />
            Записване
            </Button>
        </div>
      </React.Fragment>}

      {moment().isAfter(end) && <React.Fragment>
        <Typography>Записването за този турнир е приключило.</Typography>
      </React.Fragment>}
    </React.Fragment>
  );

  if (enrollment)
    Body = (
      <React.Fragment>
        <ConfirmationDialog
          title="Отписване от турнир"
          body={<Typography>
            Сигурни ли сте че искате да се отпишете от турнир {scheme.name}?
                <Typography variant="caption">Ако сте в отбор, то и другият играч ще бъде отписан.</Typography>
          </Typography>}
          onAccept={cancelEnroll}
        >
          <div className="buttons">
            <Button variant="contained" color="secondary">
              <EditBoxedIcon width="1em" height="1em" style={{ marginRight: '.3em' }} />
              Отписване
            </Button>
          </div>
        </ConfirmationDialog>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <Hidden smUp>
        {Body}
      </Hidden>

      <Hidden xsDown>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Записване</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.register_widget}>
            {Body}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Hidden>
    </React.Fragment>
  );
}

export const SchemesWidget = ({ scheme, classes, history }) => {
  const navigateBracket = () => {
    if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN || scheme.bracketStatus == BracketStatus.ELIMINATION_END)
      history.push(`/schemes/${scheme.id}/elimination`);
  };

  const navigateGroups = () => {
    if (scheme.bracketStatus != BracketStatus.UNDRAWN)
      history.push(`/schemes/${scheme.id}/groups`);
  };

  const Body = (
    <React.Fragment>
      {scheme.hasGroupPhase && <Paper elevation={1} className={classes.schemes_widget_tile} onClick={navigateGroups}>
        <GroupIcon width="100px" height="100px" />
        <Typography>Групи</Typography>
      </Paper>}

      <Paper elevation={1} className={classes.schemes_widget_tile} onClick={navigateBracket}>
        <BracketIcon width="100px" height="100px" />
        <Typography>Преглед</Typography>
      </Paper>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Hidden smUp>
        {Body}
      </Hidden>

      <Hidden xsDown>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Схема</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.schemes_widget}>
            {Body}
          </ExpansionPanelDetails >
        </ExpansionPanel >
      </Hidden>
    </React.Fragment>
  );
}

export const EnrollmentsWidget = ({ scheme, mode, enrolled, classes }) => {
  return (
    <React.Fragment>
      <Hidden smUp>
        <Typography variant="title" className={classes.mobile_heading}>Записани участници</Typography>
        <Paper className={classes.enrollments_widget}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div style={{ flexBasis: '45%' }}>
              {enrolled.slice(0, enrolled.length / 2).map((enrollment, index) => {
                return (
                  <React.Fragment key={index}>
                    <Typography>{enrollment.team.user1.name}</Typography>
                    {enrollment.team.user2
                      && <Typography style={{ marginBottom: '.3em' }}>{enrollment.team.user2.name}</Typography>}
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{ flexBasis: '45%' }}>
              {enrolled.slice(enrolled.length / 2).map((enrollment, index) => {
                return (
                  <React.Fragment key={index}>
                    <Typography>{enrollment.team.user1.name}</Typography>
                    {enrollment.team.user2
                      && <Typography style={{ marginBottom: '.3em' }}>{enrollment.team.user2.name}</Typography>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </Paper>
      </Hidden>
      <Hidden xsDown>
        <EnrollmentsComponent scheme={scheme} mode={mode} enrolled={enrolled} />
      </Hidden>
    </React.Fragment>
  );
}

export const FinalMatchWidget = ({ scheme, classes, match }) => {
  const TableRow = ({ team, isWinner }) => {
    if (!team)
      return (<Typography variant="headline" align="center">TBD</Typography>);

    return (
      <Paper className={isWinner ? 'row-root winner' : 'row-root'}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Thumbnail fileId={team.user1.thumbnailId} default="/assets/tennis-player-free-vector.jpg" style={{ height: '35px', width: '35px' }} />
          {team.user2 && <Thumbnail fileId={team.user2.thumbnailId} default="/assets/tennis-player-free-vector.jpg" style={{ height: '35px', width: '35px', marginLeft: '.3em' }} />}
        </div>

        <div style={{
          flexGrow: 1,
          textTransform: 'uppercase',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: '.5em'
        }}>
          <Typography>{splitAndFormatName(team.user1.name)}</Typography>
          {team.user2 && <Typography>{splitAndFormatName(team.user2.name)}</Typography>}
        </div>

        {isWinner && <Typography variant="title" color="primary" style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <WinnerIcon height="1em" width="1em" />
        </Typography>}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '1em',
          fontStyle: 'italic'
        }}>
          {match.sets && match.sets.map(set => {
            return (
              <div style={{ marginRight: '.3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {match.team1Id == team.id && <Typography>{set.team1}</Typography>}
                {match.team2Id == team.id && <Typography>{set.team2}</Typography>}
                {set.tiebreaker && match.team1Id == team.id && set.team1 < set.team2
                  && <Typography><sup>({set.tiebreaker})</sup></Typography>}
                {set.tiebreaker && match.team2Id == team.id && set.team2 < set.team1
                  && <Typography><sup>({set.tiebreaker})</sup></Typography>}
              </div>
            );
          })}
        </div>
      </Paper>
    );
  }

  const TableView = (
    <div className="table-root">
      <TableRow team={match.team1} isWinner={match.winnerId && match.winnerId == match.team1Id} />
      <TableRow team={match.team2} isWinner={match.winnerId && match.winnerId == match.team2Id} />
    </div>
  );

  const SingleTeamView = ({ team, hasWinner, isWinner }) => {
    return (
      <div className="player">
        {!team && <Typography variant="headline" align="center">TBD</Typography>}
        {team && <React.Fragment>
          <Thumbnail fileId={team.user1.thumbnailId} default="/assets/tennis-player-free-vector.jpg" />
          <div>
            <Typography variant="headline">{team.user1.name}</Typography>
            {hasWinner && isWinner && <Typography color="primary">Победител</Typography>}
            {hasWinner && !isWinner && <Typography color="primary">Финалист</Typography>}
          </div>
        </React.Fragment>}
      </div>
    );
  }

  const SingleView = (
    <div className="root">
      <SingleTeamView team={match.team1} hasWinner={match.winnerId} isWinner={match.winnerId == match.team1Id} />

      <div className="score">
        {match.sets && match.sets.map(set => {
          return (
            <Typography key={set.id} variant="title" style={{ fontStyle: 'italic' }}>{set.team1} - {set.team2} {set.tiebreaker && <sup>({set.tiebreaker})</sup>}</Typography>
          );
        })}
        {!match.sets.length && <Typography variant="headline" style={{ fontStyle: 'italic' }}>VS</Typography>}
      </div>

      <SingleTeamView team={match.team2} hasWinner={match.winnerId} isWinner={match.winnerId == match.team2Id} />
    </div>
  );

  return (
    <React.Fragment>
      <Hidden smUp>
        <div className={classes.finale_widget}>
          <Typography variant="title" className={classes.mobile_heading}>Финал</Typography>
          {TableView}
        </div>

      </Hidden>

      <Hidden xsDown>
        {/* <Paper style={{ padding: '1em 0' }} className={classes.finale_widget}>
          <Typography align="center" variant="title" >Финал</Typography>
          {TableView}
        </Paper> */}
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Финал</Typography>
          </ExpansionPanelSummary>
          {!scheme.singleTeams && <ExpansionPanelDetails className={classes.finale_widget}>
            {TableView}
          </ExpansionPanelDetails>}

          {scheme.singleTeams && <ExpansionPanelDetails className={classes.single_teams_finale}>
            {SingleView}
          </ExpansionPanelDetails>}
        </ExpansionPanel>
      </Hidden>
    </React.Fragment>
  );
}

export function splitAndFormatName(name) {
  return (name || '')
    .split(' ')
    .map((part, index, split) => {
      if (index == 0)
        return part.charAt(0) + '.';
      else if (index == split.length - 1)
        return part;
      else
        return '';
    })
    .join(' ');
}

