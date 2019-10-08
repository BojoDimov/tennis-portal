import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import './styles.scss';

import { ApplicationMode } from '../../enums';
import QueryService from '../../services/query.service';
import UserService from '../../services/user.service';
import MatchFormModal from '../components/MatchFormModal';

class EliminationBracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchModel: null,
      bracket: [],
      scheme: null
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService.get(`/schemes/${this.props.match.params.id}/matches/elimination`)
      .then(e => this.setState({
        bracket: this.constructBracket(e.matches, e.scheme),
        scheme: e.scheme
      }));
  }

  getRoundName(roundSize) {
    let label = `R${roundSize}`;

    if (roundSize == 8)
      label = 'QF';
    if (roundSize == 4)
      label = 'SF';
    if (roundSize == 2)
      label = 'F';

    return <Typography
      component="span"
      variant="headline"
      color="textSecondary"
      align="center"
      style={{ borderBottom: '1px solid grey' }}
    >
      {label}
    </Typography>
  }

  constructMatch(match, round, scheme) {
    return {
      schemeId: scheme.id,
      match,
      round,
      team1: null,
      team2: null,
      seed: null,
      sets: [],
      withdraw: null
    };
  }

  constructBracket(matches, scheme) {
    let size = matches.filter(match => match.round == 1).length;
    let rounds = Math.log2(size);
    let bracket = [];

    for (let round = 0; round < rounds + 1; round++) {
      bracket[round] = [];
      for (let match = 0; match < (size / (Math.pow(2, round))); match++) {
        let currentMatch = matches.find(e => e.match == match + 1 && e.round == round + 1);
        bracket[round].push(currentMatch || this.constructMatch(match + 1, round + 1, scheme));
      }
    }
    return bracket;
  }

  render() {
    const { matchModel, bracket, scheme } = this.state;
    return (
      <UserService.WithApplicationMode>
        {mode => {
          let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

          return (
            <Paper elevation={4} style={{ backgroundColor: 'rgba(255, 255, 255, .9)' }}>
              {scheme && <Typography align="center" variant="headline" style={{ padding: '2rem 0' }}>
                Елиминационна фаза
              <Link to={`/schemes/${scheme.id}`}>
                  <Typography variant="display1">{scheme.name}</Typography>
                </Link>
              </Typography>}

              {matchModel
                && <MatchFormModal
                  model={matchModel}
                  onChange={() => {
                    this.setState({ matchModel: null });
                    this.getData();
                  }}
                  onClose={() => this.setState({ matchModel: null })}
                />}

              <div className="bracket">
                {bracket.map((round, index) => {
                  return (
                    <div key={index} className="round">
                      <h3 className="round-title" style={{ padding: '.5rem' }}>
                        {this.getRoundName(round.length * 2)}
                      </h3>
                      <ul className="list">
                        {round.map((match, i) => {
                          return (
                            <li className="item" key={i}>
                              <div className="match">
                                <Match
                                  match={match}
                                  onEvent={() => this.setState({ matchModel: match })}
                                  hasPermission={hasPermission}
                                />
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </Paper>
          );
        }}
      </UserService.WithApplicationMode>
    );
  }
}

class Match extends React.Component {
  render() {
    const { match, hasPermission } = this.props;

    if (hasPermission)
      return (
        <Tooltip
          title="Въвеждане/промяна на резултат"
          placement="top"
          TransitionComponent={Zoom}
          enterDelay={0}
          onClick={this.props.onEvent}
        >
          <Paper elevation={4} className="match-box" style={{ cursor: 'pointer' }}>
            <TeamInfo team={match.team1} match={match} round={match.round} pos={1} />
            <TeamInfo team={match.team2} match={match} round={match.round} pos={2} />
          </Paper>
        </Tooltip>
      );

    else
      return (
        <Paper elevation={4} className="match-box">
          <TeamInfo team={match.team1} match={match} round={match.round} pos={1} />
          <TeamInfo team={match.team2} match={match} round={match.round} pos={2} />
        </Paper>
      );
  }
}

class TeamInfo extends React.Component {
  composeScore(sets, pos) {
    if (!sets)
      return null;
    let enemyPos = (pos == 1 ? 2 : 1);
    let result = sets.map((set, i) => {
      return (
        <span key={i} style={{ width: set.tiebreaker ? '22px' : '10px', display: 'flex' }}>
          {set['team' + pos]}
          {set['team' + enemyPos] > set['team' + pos] && set.tiebreaker
            && <div style={{ fontSize: '.5rem', marginTop: '-3px' }}>({set.tiebreaker})</div>}
        </span>
      );
    });
    return result;
  }

  render() {
    const { team, match, round, pos } = this.props;

    if (team)
      return (
        <div className="match-box-team">
          <div>
            <Typography style={{ fontSize: '.8em' }}>{team.user1.name}</Typography>
            {team.user2 &&
              <Typography style={{ fontSize: '.8em' }}>{team.user2.name}</Typography>}
          </div>
          <Typography style={{ display: 'flex' }} variant="caption">
            {this.composeScore(match.sets, pos)}
          </Typography>
        </div>
      );

    else
      return (
        <div className="match-box-team">
          <Typography style={{ fontSize: '.8em' }} variant="caption">
            {round == 1 ? 'bye' : `winner of match ${match.match * 2 + pos - 2} round ${round - 1}`}
          </Typography>
        </div>
      );
  }
}

export default EliminationBracket;