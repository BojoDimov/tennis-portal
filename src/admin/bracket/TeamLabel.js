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
          <Link to={`/users/${this.props.team.id}`}>{this.props.team.fullname}</Link>
          <span className="button-group">
            <ConfirmationButton onChange={flag => flag ? this.props.onRemove() : null}>
              <i className="fa fa-times"></i>
            </ConfirmationButton>
          </span>
        </React.Fragment>
      );
    else
      if (this.state.selectTeam)
        return (
          <React.Fragment>
            <a onClick={() => this.setState({ selectTeam: false })}>{this.state.selected ? this.state.selected.name : "bye"}</a>
            {this.state.selected ?
              <span className="button-group">
                <ConfirmationButton onChange={flag => flag ? this.setTeam() : null}>
                  <i className="fa fa-plus"></i>
                </ConfirmationButton>
              </span> : null
            }
          </React.Fragment>
        );
      else
        return (
          <Select value={this.state.selected ? this.state.selected.id : 0}
            url={`/schemes/${this.props.schemeId}/queue`}
            onChange={team => this.setState({ selectTeam: true, selected: team })}>
            <option value={0}>bye</option>
          </Select>
        );
  }
}