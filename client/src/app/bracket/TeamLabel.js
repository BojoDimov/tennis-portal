import React from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationButton, Select } from '../Infrastructure';

export class TeamLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTeam: true,
      selected: null
    }
  }

  setTeam() {
    this.setState({ selected: null });
    this.props.onChange(this.state.selected);
  }

  render() {
    if (this.props.team)
      return (
        <React.Fragment>
          <Link to={`/users/${this.props.team.user1Id}`}>{this.props.team.user1.name}</Link>
          {this.props.team.user2 ?
            <Link style={{ display: 'block' }}
              to={`/users/${this.props.team.user2Id}`}>
              {this.props.team.user2.name}
            </Link> : null}
        </React.Fragment>
      );
    else return <span>bye</span>
  }
}