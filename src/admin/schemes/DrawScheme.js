import React from 'react';
import { EventEmitter } from '../../services/events';
import { get } from '../../services/fetch';
import { Bracket } from '../bracket/Bracket';

export class DrawScheme extends React.Component {
  options = new EventEmitter();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    get(`/schemes/${this.props.match.params.id}/getDraw`)
      .then(matches => this.options.emit(matches));
  }

  createScheme() {
    get(`/schemes/${this.props.match.params.id}/draw`)
      .then(matches => this.options.emit(matches));
  }

  render() {
    return (
      <React.Fragment>
        <div className="container button-inline">
          <div className="input-group">
            <div>Позиционирани</div>
            <input type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
          </div>
          <div className="button" onClick={() => this.createScheme()} >генерирай</div>
        </div>

        <Bracket options={this.options} />
      </React.Fragment >
    );
  }
}