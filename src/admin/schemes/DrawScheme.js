import React from 'react';
import { EventEmitter } from '../../services/events';

export class DrawScheme extends React.Component {
  options = new EventEmitter();

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="container button-inline">
          <div className="input-group">
            <div>Позиционирани</div>
            <input type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
          </div>
          <div className="button" onClick={() => this.options.emit({
            seed: this.state.seed,
            teamCount: this.state.teamCount
          })} >генерирай</div>
        </div>

        {/* <Bracket options={this.options} /> */}
      </React.Fragment >
    );
  }
}