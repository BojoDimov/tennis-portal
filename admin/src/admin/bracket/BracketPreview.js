import React from 'react';
import { EliminationBracket } from '../bracket/EliminationBracket';
import { RoundRobinBracket } from '../bracket/RoundRobinBracket';

export class BracketPreview extends React.Component {
  render() {
    if (this.props.draw.isDrawn && this.props.draw.schemeType == 'elimination')
      return <EliminationBracket matches={this.props.draw.data} refresh={this.props.refresh} />;
    else if (this.props.draw.isDrawn && this.props.draw.schemeType == 'round-robin')
      return <RoundRobinBracket groups={this.props.draw.data} refresh={this.props.refresh} />;
    else return null;
  }
}