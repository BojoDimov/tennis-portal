import React from 'react';
import { post } from '../../services/fetch';
import { ConfirmationButton } from '../Infrastructure';
import { MatchScoreForm } from './MatchScoreForm';
import { Score } from './Score';

export class MatchScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMatchForm: false
    };
  }

  render() {
    return (
      <div className="dropdown">
        <div className="button" onClick={() => this.setState({ showMatchForm: !this.state.showMatchForm })}>резултат</div>
        {this.state.showMatchForm ?
          <MatchScoreForm
            match={this.props.match}
            onChange={() => { this.setState({ showMatchForm: false }); this.props.refresh(); }}
          /> : null}
      </div>
    );
  }
}