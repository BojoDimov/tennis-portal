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
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/editions/${this.state.edition.id}/draft`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <Fragment>
          <div className="container-fluid">
            <h2 className="headline">
              <span>{this.state.edition.name}</span>
              <Status status={this.state.edition.status} />
            </h2>
            <div className="card">
              <div>
                <span className="label">Турнир: </span>
                <span className="value link">
                  <Link to={`/tournaments/view/${this.state.tournament.id}`}>
                    {this.state.tournament.name}
                  </Link>
                </span>
              </div>
              <div className="value">
                <span className="label">Информация: </span>
                <span className="value">{this.state.edition.info}</span>
              </div>
              <div>
                <span className="label">Начало на турнира: </span>
                <span className="value">{dateString(this.state.edition.startDate)}</span>
              </div>
              <div>
                <span className="label">Край на турнира: </span>
                <span className="value">{dateString(this.state.edition.endDate)}</span>
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
      <div className="button-group">
        {this.state.edition.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.edition.status === 'draft' ? <span className="button"><Link to={`/editions/edit/${this.state.edition.id}`}>Промяна</Link></span> : null}
        {this.state.edition.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </div>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}