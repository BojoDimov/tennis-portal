import React, { Component } from 'react';

export class ViewTournament extends Component {
  componentDidMount() {
    console.log('mounted');
  }

  render() {
    return (
      <div className="margin container">
        <h2 className="marign section">{this.props.match.params.id}</h2>
      </div>
    );
  }
}
