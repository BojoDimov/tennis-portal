import React from 'react';

export function init_elimination_bracket(matches) {
  let bracket_size = matches.length * 2;
  let bracket = [];

  for (let i = 0; i < matches.length; i++) {
    bracket[i] = [];
    bracket[i][0] = <EntryBox match={matches[i]} />
  }

  let rounds = Math.log2(bracket_size);
  for (let round = 1; round <= rounds; round++) {
    let power = Math.pow(2, round - 1);
    for (let row = 0; row < matches.length; row += power) {
      bracket[row][round] = <Cell rowSpan={power} />
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


const Cell = ({ rowSpan }) => {
  return (<td rowSpan={rowSpan}><div className="cell"></div></td>);
}

const EntryBox = ({ match }) => {
  return (
    <td className="entry">
      <table>
        <tbody>
          <tr>
            <td className="number">{match.match * 2 - 1}</td>
            <td className="seed">{match.seed1 ? `(${match.seed1})` : null}</td>
            <td className="name">{match.team1 ? match.team1.fullname : 'bye'}</td>
          </tr>
          <tr>
            <td>{match.match * 2}</td>
            <td className="seed">{match.seed2 ? `(${match.seed2})` : null}</td>
            <td className="name delim">{match.team2 ? match.team2.fullname : 'bye'}</td>
          </tr>
        </tbody>
      </table>
    </td>
  );
}