import React from 'react';
import { Link } from 'react-router-dom';
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

  componentDidUpdate() {
    if (this.props.schemes.length > 0 && this.state.active == -1)
      this.selectScheme(0)
  }

  selectScheme(index) {
    let schemeId = this.props.schemes[index].id;
    return get(`/schemes/${schemeId}/getDraw`)
      .then(matches => {
        if (matches)
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
        <h2 className="header">
          Схеми
          <Link to={`/schemes/create?editionId=${this.props.editionId}`}>
            <span className="button-group">
              <span className="button">добавяне</span>
            </span>
          </Link>
        </h2>

        <div className="tab-group input-group">
          {this.props.schemes.map((scheme, i) =>
            <span key={scheme.id} className={'button' + (i == this.state.active ? ' active' : '')}
              onClick={() => this.selectScheme(i)}>
              {scheme.name}
            </span>
          )}
        </div>
        {this.state.active != -1 ? <div className="input-group">
          <Link to={`/schemes/view/${this.props.schemes[this.state.active].id}`}>Детайли</Link>
        </div> : null}
        {this.state.notDrawn && this.state.active != -1 ?
          <div>
            <div className="input-group"><i>Схемата не е изтеглена</i></div>
            <div className="input-group">
              <div>Брой поставени играчи</div>
              <input className="inline" type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
            </div>
            <span className="button" onClick={() => this.createScheme()} >изтегляне</span>
          </div> : null}
        {this.state.notDrawn ? null : <Bracket options={this.options} />}
      </div>
    );
  }
}