import React from 'react';

export class Score extends React.Component {
  render() {
    if (this.props.withdraw) {
      return <i className="score">{`отказал се играч ${this.props.withdraw}`}</i>
    }
    else if (this.props.sets.length > 0)
      return <div className="button-group score">
        {this.props.sets.map((set, i) => {
          if (this.props.reversed)
            return (
              <React.Fragment key={i}>
                <span>{(" " + set.team2).split('(')[0]}</span>
                <span>{(set.team1 + "").split('(')[0]}</span>
                <sup>{set.tiebreaker}</sup>
              </React.Fragment>
            );
          else
            return (
              <React.Fragment key={i}>
                <span>{(" " + set.team1).split('(')[0]}</span>
                <span>{(set.team2 + "").split('(')[0]}</span>
                <sup>{set.tiebreaker}</sup>
              </React.Fragment>
            );
        })}
      </div>
    else return null;
  }
}