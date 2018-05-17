import React, { Component, Fragment } from 'react';
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
    get(`/tournaments/${this.props.match.params.id}`)
      .then(res => {
        console.log(res);
        res.loading = false;
        this.setState(res);
      });
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <Fragment>
          <div className="margin container-fluid">
            <h2 className="section"><span>{this.state.tournament.name}</span> <Status status={this.state.tournament.status} /></h2>
            <p>{this.state.tournament.info}</p>
          </div>
          <ItemList items={this.state.editions} name="Издания" match={{ path: '/editions' }} />
          <div className="margin container-fluid">
            <h2 className="section"><span>Ранглиста</span></h2>
          </div>
        </Fragment>
      );
  }
}
