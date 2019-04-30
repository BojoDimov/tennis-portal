import React from 'react';
import { init_elimination_bracket, get_elimination_headers } from './bracket-utils';

export class EliminationBracket extends React.Component {
  render() {
    return (
      <div>
        <table className="elimination-table">
          <thead>
            <tr>
              {get_elimination_headers(this.props.matches).map((header, i) => <th key={i}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {init_elimination_bracket(this.props.matches, this.props.refresh).map((row, index) => <tr key={index}>{row}</tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}