import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';
import UserService from '../../services/user.service';

const styles = (theme) => {
  console.log(theme);
  return ({
    cardRoot: {
      width: '100%',
      marginBottom: '1rem'
    },
    vsRoot: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
      }
    },
    vs: {
      flexGrow: '1',
      display: 'flex',
      justifyContent: 'center',
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
      [theme.breakpoints.down('sm')]: {
        margin: '.5rem 0',
        fontSize: '.8em',
        color: theme.palette.text.primary
      }
    },
    score: {
      color: theme.palette.text.secondary,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1em',
        color: theme.palette.text.primary
      }
    },
    vsTeam: {
      fontSize: '1.3rem'
    }
  });
}

class MatchDetails extends React.Component {
  render() {
    const { match, classes } = this.props;

    return (
      <Card className={classes.cardRoot}>
        <CardContent>
          <div className={classes.vsRoot}>
            {match.team1 &&
              <Link to={`/users/${match.team1.id}`} style={{ flexBasis: '33%' }}>
                <Typography variant="body2" className={classes.vsTeam}>
                  {match.team1.user1.name}
                </Typography>
                {match.team1.user2 &&
                  <Typography variant="body2" className={classes.vsTeam}>
                    {match.team1.user2.name}
                  </Typography>}
              </Link>}

            {!match.team1 && <Typography style={{ textAlign: 'center' }}>BYE</Typography>}

            <StyledScore sets={match.sets} />

            {match.team2 && <Link to={`/users/${match.team1.user2Id}`} style={{ flexBasis: '33%' }}>
              <Typography variant="body2" className={classes.vsTeam}>
                {match.team2 ? match.team2.user1.name : 'BYE'}
              </Typography>
              {/* {match.team2 && match.team2.user2 &&
                <Typography variant="body2" className={classes.vsTeam}>
                  {match.team2.user2.name}
                </Typography>} */}
            </Link>}

            {!match.team2 && <Typography style={{ flexBasis: '33%' }}>BYE</Typography>}

          </div>
          <Typography variant="subheading">
            <span style={{ color: '#8AC230', fontWeight: '700' }}>Победител:</span>
            {match.team1 && <span style={{ fontStyle: 'italic', marginLeft: '.3rem' }}>{match.team1.user1.name}</span>}
          </Typography>
          <Typography variant="subheading">
            <span style={{ color: '#D67D2A', fontWeight: '700' }}>Отказал се:</span>
            {match.team2 && <span style={{ fontStyle: 'italic', marginLeft: '.3rem' }}>{match.team2.user1.name}</span>}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

class Score extends React.Component {
  render() {
    const { sets, classes } = this.props;
    console.log(sets);
    if (sets.length == 0) {
      console.log('wa');
      return (
        <Typography variant="headline" className={classes.vs}>
          VS
        </Typography>
      );
    }

    else
      return (
        <div className={classes.vs}>
          {sets.map(set => {
            return (
              <div key={set.id} style={{ display: 'flex', marginRight: '.3rem' }}>
                <Typography variant="headline" className={classes.score}>
                  {set.team1}
                </Typography>
                <Typography variant="headline" className={classes.score}>
                  {set.team2}
                </Typography>
                {set.tiebreaker && <sup>
                  <Typography variant="headline" style={{ fontSize: '1em' }} className={classes.score}>
                    ({set.tiebreaker})
                  </Typography>
                </sup>}
              </div>
            );
          })}
        </div>
      );
  }
}

const StyledScore = withStyles(styles)(Score);

export default withStyles(styles)(MatchDetails);