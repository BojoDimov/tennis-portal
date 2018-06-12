import React from 'react';
import { init_bracket, get_headers } from './bracket-utils';
import './Bracket.css';

export class Bracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bracket: [],
      matches: []
    };
  }

  componentDidMount() {
    this.props.options.then((matches) => this.setState({
      bracket: init_bracket(matches),
      matches: matches
    }));
  }

  render() {
    return (
      <div className="container">
        <table className="bracket">
          <thead>
            <tr>
              {get_headers(this.state.matches).map((header, i) => <th key={i}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.state.bracket.map((row, index) => <tr key={index}>{row}</tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}