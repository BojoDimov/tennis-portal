import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status, ItemList } from '../Infrastructure';

export class ViewTournament extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      editions: [],
      loading: true
    };
  }

  componentDidMount() {
    return this.getData();
  }

  getData() {
    return get(`/tournaments/${this.props.match.params.id}`)
      .then(res => {
        res.loading = false;
        this.setState(res);
      });
  }

  publish() {
    get(`/tournaments/${this.state.tournament.id}/publish`)
      .then(() => this.getData());
  }

  draft() {
    get(`/tournaments/${this.state.tournament.id}/draft`)
      .then(() => this.getData());
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <Fragment>
          <div className="margin container-fluid">
            <h2 className="section"><span>{this.state.tournament.name}</span> <Status status={this.state.tournament.status} /></h2>
            <div className="margin-left">
              <div className="card">
                <span className="card-heading">Информация: </span>
                <span>{this.state.tournament.info}</span>
              </div>
            </div>
            {this.buttons()}
          </div>
          <ItemList items={this.state.editions} name="Издания" match={{ path: '/editions' }} rootQuery={`tournamentId=${this.state.tournament.id}`} />
          <div className="margin container-fluid">
            <h2 className="section"><span>Ранглиста</span></h2>
          </div>
        </Fragment>
      );
  }

  buttons() {
    return (
      <div className="color margin-top">
        {this.state.tournament.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.tournament.status === 'draft' ? <Link to={`/tournaments/edit/${this.state.tournament.id}`}><span className="button spacing">Промяна</span></Link> : null}
      </div>
    );
  }
}
