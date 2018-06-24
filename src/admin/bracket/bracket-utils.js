import React from 'react';
import { EliminationEntryBox } from './EliminationEntryBox';

const Cell = ({ rowSpan }) => {
  return (<td rowSpan={rowSpan}><div className="cell"></div></td>);
}

export function init_elimination_bracket(matches, refresh_handler) {
  let bracket_size = matches.length * 2;
  let bracket = [];

  for (let i = 0; i < matches.length; i++) {
    bracket[i] = [];
    bracket[i][0] = <EliminationEntryBox key={0} match={matches[i]} refresh={refresh_handler} />
  }

  let rounds = Math.log2(bracket_size);
  for (let round = 1; round <= rounds; round++) {
    let power = Math.pow(2, round - 1);
    for (let row = 0; row < matches.length; row += power) {
      bracket[row][round] = <Cell key={round} rowSpan={power} />
    }
  }
  return bracket;
}

export function get_elimination_headers(matches) {
  let bracket_size = matches.length * 2;
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




