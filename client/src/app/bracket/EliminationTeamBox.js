import React from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationButton } from '../Infrastructure';
import { MatchScore } from './MatchScore';
import { Score } from './Score';
import { post } from '../../services/fetch';


export class EliminationTeamBox extends React.Component {
  render() {
    return (
      <div className="center team-label">
        {this.props.team ?
          <div>
            <Link to={`/users/${this.props.team.user1Id}`}>
              {this.props.team.user1.name}
            </Link>
            {this.props.team.user2 ?
              <Link style={{ display: 'block' }}
                to={`/users/${this.props.team.user2Id}`}>
                {this.props.team.user2.name}
              </Link> : null}
          </div>
          : null
        }

        {this.props.previousMatch && this.props.previousMatch.team1 && this.props.previousMatch.team2 ?
          <Score sets={this.props.previousMatch.sets} />
          : null
        }
      </div>
    );
  }
}