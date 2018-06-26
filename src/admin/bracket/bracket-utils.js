import React from 'react';
import { EliminationEntryBox } from './EliminationEntryBox';
import { Link } from 'react-router-dom';

const Cell = ({ rowSpan }) => {
  return (<td rowSpan={rowSpan}><div className="cell"></div></td>);
}

const Temp = ({ rowSpan, team }) => {
  return (<td rowSpan={rowSpan}><div className="team-label"><Link to={`/users/${team.id}`}>{team.fullname}</Link></div></td>);
}

export function init_elimination_bracket(matches, refresh_handler) {
  let startingMatches = matches.filter(match => match.round == 1);
  let bracket_size = startingMatches.length * 2;
  let bracket = [];

  for (let i = 0; i < startingMatches.length; i++) {
    bracket[i] = [];
    bracket[i][0] = <EliminationEntryBox key={0} match={startingMatches[i]} refresh={refresh_handler} />
  }

  let rounds = Math.log2(bracket_size);
  for (let round = 1; round <= rounds; round++) {
    let power = Math.pow(2, round - 1);
    for (let row = 0; row < startingMatches.length; row += power) {
      let matchId = Math.ceil((row + 1) / 2);
      let roundId = round + 1;

      let match = matches.find(match => match.round == roundId && match.match == matchId);
      if (match && row % 2 == 0 && match.team1)
        bracket[row][round] = <Temp key={round} rowSpan={power} team={match.team1} />
      else if (match && row % 2 != 0 && match.team2)
        bracket[row][round] = <Temp key={round} rowSpan={power} team={match.team2} />
      else
        bracket[row][round] = <Cell key={round} rowSpan={power} />
    }
  }

  //set the winner

  return bracket;
}

export function get_elimination_headers(matches) {
  let bracket_size = matches.filter(match => match.round == 1).length * 2;
  let headers = [];
  while (bracket_size > 1) {
    if (bracket_size == 8)
      headers.push('QF');
    else if (bracket_size == 4)
      headers.push('SF');
    else if (bracket_size == 2)
      headers.push('F');
    else
      headers.push('R' + bracket_size);

    bracket_size /= 2;
  }

  if (matches.length)
    headers.push('Winner');
  return headers;
}




