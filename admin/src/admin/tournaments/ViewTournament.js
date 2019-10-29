import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status, ConfirmationButton } from '../Infrastructure';
import { EditionsTable } from '../editions/Editions';
import { updateBreadcrumb } from '../../public/Breadcrumb';

export class ViewTournament extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: [],
      ranking: []
    };
  }

  componentDidMount() {
    return this.getData()
      .then((tournament) => updateBreadcrumb(this.getPath()));
  }

  getPath() {
    return [
      { title: this.state.name, link: `/tournaments/view/${this.state.id}` }
    ]
  }

  getData() {
    return get(`/tournaments/${this.props.match.params.id}`)
      .then(res => {
        res.loading = false;
        this.setState(res);
        return res;
      });
  }

  updatePath(tournament) {
    this.props.onInit({
      name: tournament.name,
      link: `/tournaments/view/${tournament.id}`
    });
    return true;
  }

  publish() {
    get(`/tournaments/${this.state.id}/publish`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/tournaments/${this.state.id}/draft`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  render() {
    return (
      <Fragment>
        <div className="container">
          <table className="list-table">
            <thead>
              <tr>
                <th>
                  <span>{this.state.name}</span>
                  <Status status={this.state.status} />
                  {this.buttons()}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="labels"><b>Информация</b></td><td>{this.state.info}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EditionsTable editions={this.state.editions} tournamentId={this.state.id} />

        <RankList ranking={this.state.ranking} />

      </Fragment>
    );
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.status === 'draft' ? <ConfirmationButton onChange={flag => flag ? this.publish() : null}>Публикуване</ConfirmationButton> : null}
        {this.state.status === 'draft' ? <span className="button"><Link to={`/tournaments/edit/${this.state.id}`}>Промяна</Link></span> : null}
        {this.state.status === 'published' ? <ConfirmationButton onChange={flag => flag ? this.draft() : null}>Връщане в чернова</ConfirmationButton> : null}
      </span>
    );
  }
}

export class RankList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10
    }
  }
  render() {
    return (
      <div className="container">
        <table className="list-table input-group">
          <thead>
            <tr>
              <th>
                <span>Ранглиста</span>
              </th>
              <th className="text-right">
                Точки
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.ranking.slice(0, this.state.limit).map(e => (
              <tr key={e.id}>
                <td>
                  <Link to={`/users/${e.team.user1Id}`} >{e.team.user1.name}</Link>
                </td>
                <td className="text-right">
                  {e.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.limit < this.props.ranking.length ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: this.props.ranking.length + 1 })}>
              покажи всичко
              </a>
          </div> : null}
        {this.state.limit > this.props.ranking.length ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: 10 })}>
              скрий
              </a>
          </div> : null}
      </div>
    );
  }
}