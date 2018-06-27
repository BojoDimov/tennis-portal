import React from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationButton } from '../Infrastructure';
import { MatchScoreForm } from './MatchScoreForm';
import { MatchScore2 } from './MatchScore';
import { Score } from './Score';
import { post } from '../../services/fetch';


export class EliminationTeamBox extends React.Component {
  render() {
    return (
      <div className="center team-label">
        {this.props.team ?
          <div>
            <Link to={`/users/${this.props.team.id}`}>
              {this.props.team.fullname}
            </Link>
          </div>
          : null
        }

        {this.props.previousMatch && this.props.previousMatch.team1 && this.props.previousMatch.team2 ?
          <React.Fragment>
            <Score sets={this.props.previousMatch.sets} />
            <MatchScore2 match={this.props.previousMatch} refresh={this.props.refresh} />
          </React.Fragment>
          : null
        }
      </div>
    );
  }
}