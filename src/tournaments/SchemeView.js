import React from 'react';
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
import TournamentIcon from '../components/icons/TournamentIcon';
import { ApplicationMode } from '../enums';
import { catchEvent } from '../services/events.service';
import EnrollmentsComponent from '../schemes/components/Enrollments';

class SchemeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: {
        edition: {
          tournament: {}
        }
      },
      enrolled: []
    }
  }

  render() {
    const { scheme, enrolled } = this.state;
    const { classes } = this.props;

    return (
      <UserService.WithApplicationMode>
        {mode => {
          let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

          return (
            <div className="container">
              <Paper className={classes.root}>
                <Typography className={classes.heading}>{scheme.name}</Typography>
                <SchemeInfoBar scheme={scheme} playerCount={enrolled.length} classes={classes} />
                <Typography>{scheme.info}</Typography>
                <div className={classes.widgets_root}>
                  <div style={{ flexBasis: '40%' }}>
                    <RegisterWidget scheme={scheme} refresh={() => this.getData()} classes={classes} />
                  </div>
                  <div style={{ flexGrow: 1, marginLeft: '2em' }}>
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
    </div>
  );
}

const RegisterWidget = ({ scheme, refresh, classes }) => {
  return (
    <ExpansionPanel defaultExpanded style={{ flexBasis: '40%' }}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="headline">Записване</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.register_widget}>
        <Typography>Остават 8 дена 3 часа и 5 минути до края на записването.</Typography>
        <div className="buttons">
          <Button variant="contained" color="primary">Записване</Button>
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
    display: 'flex'
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