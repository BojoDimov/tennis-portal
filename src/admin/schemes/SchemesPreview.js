import React from 'react';
import { get } from '../../services/fetch';
import { Bracket } from '../bracket/Bracket';
import { EventEmitter } from '../../services/events';

export class SchemesPreview extends React.Component {
  options = new EventEmitter();
  constructor(props) {
    super(props)
    this.state = {
      active: -1,
      notDrawn: true
    }
  }

  componentDidMount() {
    if (this.props.schemes.length > 0)
      this.selectScheme(0)

  }

  componentDidChange() {
    console.log('changes');
  }

  // componentDidUpdate() {
  //   if (this.state.active == -1 && this.props.schemes.length > 0)
  //     this.selectScheme(0)
  // }

  selectScheme(index) {
    let schemeId = this.props.schemes[index].id;
    return get(`/schemes/${schemeId}/getDraw`)
      .then(matches => {
        if (matches.length == 0)
          this.setState({ notDrawn: true });
        else
          this.setState({ notDrawn: false });
        return this.options.emit(matches);
      })
      .then(() => this.setState({ active: index }));
  }

  createScheme() {
    let schemeId = this.props.schemes[this.state.active].id;
    get(`/schemes/${schemeId}/draw?seed=${this.state.seed}`)
      .then(matches => this.options.emit(matches));
  }

  render() {
    return (
      <div className="container">
        <div className="tab-group input-group">
          {this.props.schemes.map((scheme, i) =>
            <span className={'button' + (i == this.state.active ? ' active' : '')}
              onClick={() => this.selectScheme(i)}>
              {scheme.name}
            </span>
          )}
        </div>
        {this.state.notDrawn ?
          <div>
            <div className="input-group"><i>Схемата не е изтеглена</i></div>
            <div className="input-group">
              <div>Брой позиционирани играчи</div>
              <input className="inline" type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
            </div>
            <span className="button" onClick={() => this.createScheme()} >изтегляне</span>
          </div> : null}
        <Bracket options={this.options} />
      </div>
    );
  }
}