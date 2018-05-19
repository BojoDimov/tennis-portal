import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status, ItemList } from '../Infrastructure';

export class ViewEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      edition: {},
      schemes: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return get(`/editions/${this.props.match.params.id}`)
      .then(res => {
        res.loading = false;
        this.setState(res);
      });
  }

  publish() {
    get(`/editions/${this.state.edition.id}/publish`)
      .then(() => this.getData());
  }

  draft() {
    get(`/editions/${this.state.edition.id}/draft`)
      .then(() => this.getData());
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <Fragment>
          <div className="margin container-fluid">
            <h2 className="section"><span>{this.state.edition.name}</span> <Status status={this.state.edition.status} /></h2>
            <div className="margin-left">
              <div className="card">
                <span className="card-heading">Турнир: </span>
                <Link to={`/tournaments/view/${this.state.tournament.id}`}>
                  <span className="card-link">{this.state.tournament.name}</span>
                </Link>
              </div>
              <div className="card">
                <span className="card-heading">Информация: </span>
                <span>{this.state.edition.info}</span>
              </div>
              <div className="card">
                <span className="card-heading">Начало на турнира: </span>
                <span>{dateString(this.state.edition.startDate)}</span>
              </div>
              <div className="card">
                <span className="card-heading">Край на турнира: </span>
                <span>{dateString(this.state.edition.endDate)}</span>
              </div>
            </div>
            {this.buttons()}
          </div>
          <ItemList name="Схеми" items={this.state.schemes} match={{ path: '/schemes' }} rootQuery={`editionId=${this.state.edition.id}`} />
        </Fragment>
      );
  }

  buttons() {
    return (
      <div className="color margin-top">
        {this.state.edition.status === 'draft' ? <Link to={`/editions/edit/${this.state.edition.id}`}><span className="button">Промяна</span></Link> : null}
        {this.state.edition.status === 'draft' ? <span className="button spacing" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.edition.status === 'published' ? <span className="button spacing" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </div>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}