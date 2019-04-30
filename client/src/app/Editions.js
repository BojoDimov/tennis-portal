import React from 'react';
import { Link } from 'react-router-dom';
import Queries from '../services/queries';
import './fast-styles.css';

export default class Editions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: []
    }
  }

  componentDidMount() {
    Queries.Editions.get().then(editions => this.setState({ editions: editions }))
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container list">
          {this.state.editions.map(this.getEdition)}
        </div>
      </div>
    );
  }

  getEdition(edition, i) {
    return (
      <div className="button list-row" key={i}>
        <img src="images/smile-logo.jpg" />
        <div style={{ flexGrow: 1 }}>
          <div className="list-row-header">{edition.name}</div>
          <div style={{ fontWeight: 700 }}>{getLocaleDate(edition.startDate)} - {getLocaleDate(edition.endDate)}</div>
        </div>

        <div style={{ width: '10rem' }}>
          {hasFinished(edition) ?
            <Link to={`/editions/${edition.id}`} className="special-button b">Преглед</Link>
            : null}
          {!hasStarted(edition) ?
            <Link to={`/editions/${edition.id}`} className="special-button g">Участвай</Link>
            : null}
          {hasStarted(edition) && !hasFinished(edition) ?
            <Link to={`/editions/${edition.id}`} className="special-button b">Разпределение</Link>
            : null}
        </div>
      </div>
    );
  }
}

function hasStarted(edition) {
  return new Date() >= new Date(edition.startDate);
}

function hasFinished(edition) {
  return new Date() >= new Date(edition.endDate);
}

function getLocaleDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}
