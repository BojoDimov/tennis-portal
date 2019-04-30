import React from 'react';
import { get } from '../services/fetch';
import { BracketPreview } from './bracket/BracketPreview';

export default class SchemeBracketView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draw: null
    }
  }

  componentDidMount() {
    get(`/schemes/${this.props.match.params.id}/draws`)
      .then(e => this.setState({ draw: e }));
  }

  render() {
    return (
      <div style={{ overflowX: 'auto' }}>
        {this.state.draw ? <BracketPreview draw={this.state.draw} /> : null}
      </div>
    )
  }
}