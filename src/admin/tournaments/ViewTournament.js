import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status, ItemList } from '../Infrastructure';
import { EditionsTable } from '../editions/Editions';

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
            <table className="list-table">
              <thead>
                <tr>
                  <th>
                    <span>{this.state.tournament.name}</span>
                    <Status status={this.state.tournament.status} />
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
                          <td className="labels"><b>Информация</b></td><td>{this.state.tournament.info}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <EditionsTable editions={this.state.editions} />

          <div className="container-fluid">
            <h2 className="headline"><span>Ранглиста</span></h2>
          </div>
        </Fragment>
      );
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.tournament.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.tournament.status === 'draft' ? <span className="button"><Link to={`/tournaments/edit/${this.state.tournament.id}`}>Промяна</Link></span> : null}
        {this.state.tournament.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </span>
    );
  }
}
