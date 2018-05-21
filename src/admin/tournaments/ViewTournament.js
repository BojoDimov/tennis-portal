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
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/tournaments/${this.state.tournament.id}/draft`)
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
              <span>{this.state.tournament.name}</span>
              <Status status={this.state.tournament.status} />
            </h2>
            <div className="card">
              <div>
                <span className="label">Информация: </span>
                <span className="value">{this.state.tournament.info}</span>
              </div>
            </div>
            {this.buttons()}
          </div>

          <ItemList items={this.state.editions} name="Издания" match={{ path: '/editions' }} rootQuery={`tournamentId=${this.state.tournament.id}`} />

          <div className="container-fluid">
            <h2 className="headline"><span>Ранглиста</span></h2>
          </div>
        </Fragment>
      );
  }

  buttons() {
    return (
      <div className="button-group">
        {this.state.tournament.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.tournament.status === 'draft' ? <span className="button"><Link to={`/tournaments/edit/${this.state.tournament.id}`}>Промяна</Link></span> : null}
        {this.state.tournament.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </div>
    );
  }
}
