import React from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { BracketPreview } from '../bracket/BracketPreview';
import { BracketDrawForm } from '../bracket/BracketDrawForm';
import { ConfirmationButton } from '../Infrastructure';

export class SchemesPreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: -1,
      draw: {}
    }
  }

  componentDidUpdate() {
    if (this.props.schemes.length > 0 && this.state.active == -1)
      this.selectScheme(0)
  }

  selectScheme(index) {
    return get(`/schemes/${this.props.schemes[index].id}/getDraw`)
      .then(draw => this.setState({ active: index, draw: draw }));
  }

  finishDraw() {
    return get(`/schemes/${this.props.schemes[this.state.active].id}/finishDraw`);
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

        <div className="tab-group input-group button-group">
          {this.props.schemes.map((scheme, i) =>
            <span key={scheme.id} className={'button' + (i == this.state.active ? ' active' : '')}
              onClick={() => this.selectScheme(i)}>
              {scheme.name}
            </span>
          )}
        </div>

        {this.state.active != -1 ?
          <div className="input-group">
            <div><i>{this.state.draw.schemeType === 'elimination' ? 'Елиминационна схема' : 'Групова фаза'}</i></div>
            <Link to={`/schemes/view/${this.props.schemes[this.state.active].id}`}><div className="input-group">детайли</div></Link>
            <ConfirmationButton onChange={flag => flag ? this.finishDraw() : null}>
              финализиране на схемата
            </ConfirmationButton>
          </div>
          : null}

        <BracketDrawForm draw={this.state.draw} onChange={draw => this.setState({ draw: draw })} />
        <BracketPreview draw={this.state.draw} refresh={() => { console.log('calling refresh'); this.selectScheme(this.state.active) }} />
      </div>
    );
  }
}