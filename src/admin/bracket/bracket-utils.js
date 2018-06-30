import React from 'react';
import { EliminationEntryBox } from './EliminationEntryBox';
import { EliminationTeamBox } from './EliminationTeamBox';

export function init_elimination_bracket(matches, refresh_handler) {
  let startingMatches = matches.filter(match => match.round == 1);
  let bracket_size = startingMatches.length * 2;
  let bracket = [];

  for (let i = 0; i < startingMatches.length; i++) {
    bracket[i] = [];
    bracket[i][0] = <EliminationEntryBox key={0} match={startingMatches[i]} refresh={refresh_handler} />
  }

  let rounds = Math.log2(bracket_size);
  for (let col = 1, round = 2; col <= rounds; col++ , round++) {
    let power = Math.pow(2, col - 1);
    for (let row = 0, match = 1; row < startingMatches.length; row += power, match += 1 / 2) {
      let pos = Math.floor(match) < match ? 1 : 0;
      let currentMatch = matches.find(e => e.round == round && e.match == Math.floor(match));
      let previousMatch = get_prev_match(pos, Math.floor(match), round, matches);
      let teams = currentMatch ? [currentMatch.team1, currentMatch.team2] : [null, null];

      bracket[row][col] = (
        <td key={col} rowSpan={power}>
          <EliminationTeamBox
            team={teams[pos]}
            previousMatch={previousMatch}
            refresh={refresh_handler}
          />
        </td>
      );
    }
  }

  return bracket;
}

export function get_prev_match(pos, matchId, roundId, matches) {
  let t = (pos == 0 ? -1 : 0);
  let match = matches.find(e => e.match == 2 * matchId + t && e.round == roundId - 1);
  return match;
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




