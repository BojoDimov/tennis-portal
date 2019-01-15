import React from 'react';
import { Link } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';
import UserService from '../../services/user.service';
import MatchDetails from './MatchDetails';

const styles = (theme) => ({
  roundMarker: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '.5rem'
  },
  roundMarkerStrip: {
    flexGrow: 1,
    backgroundColor: '#c9c9c9',
    height: '2px',
    borderRadius: '2px'
  },
  roundMarkerLabel: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    margin: '0 .5rem'
  }
});

class MatchesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
      teams: [],
      isAdmin: UserService.isAdmin()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.schemeId != this.props.schemeId)
      this.getData();
  }

  getData() {
    const { schemeId } = this.props;
    const uniqueTeam = (acc, curr) => {
      if (acc.find(e => e.id == curr.id)) return acc;
      else return acc.concat([curr]);
    };

    QueryService
      .get(`/schemes/${schemeId}/matches`)
      .then(e => this.setState({
        matches: e,
        teams: e.map(m => m.team1)
          .concat(e.map(m => m.team2))
          .filter(t => t != null)
          .reduce(uniqueTeam, [])
      }));
  }

  render() {
    const { matches, teams } = this.state;
    const { classes } = this.props;
    const match = matches[0];

    return (
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title">Мачове</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
          <div className={classes.roundMarker}>
            <div className={classes.roundMarkerStrip}></div>
            <Typography variant="headline" className={classes.roundMarkerLabel}>
              R64
            </Typography>
            <div className={classes.roundMarkerStrip}></div>
          </div>
          {matches.map(match => {
            return (
              <MatchDetails key={match.id} match={match} />
            );
          })}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(MatchesList);