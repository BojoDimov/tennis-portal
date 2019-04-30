import React from 'react';
import { post } from '../../services/fetch';
import { Status } from '../../enums';

export class BracketDrawForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  draw() {
    post(`/schemes/${this.props.draw.schemeId}/draws`, { seed: this.state.seed })
      .then(draw => this.props.onChange(draw));
  }

  render() {
    if (this.props.draw && !this.props.draw.isDrawn && !this.props.draw.isLinked && this.props.draw.status === Status.PUBLISHED)
      return (
        <div>
          <div className="input-group"><i>Схемата не е изтеглена</i></div>
          <div className="input-group">
            <div>Брой поставени играчи</div>
            <input className="inline" type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
          </div>
          <span className="button" onClick={() => this.draw()} >изтегляне</span>
        </div>
      );
    else
      return null;
  }
}