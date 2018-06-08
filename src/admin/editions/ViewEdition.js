import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status } from '../Infrastructure';
import { SchemesTable } from '../schemes/Schemes';

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
          <div className="container test">
            <table className="list-table">
              <thead>
                <tr>
                  <th>
                    <span>{this.state.edition.name}</span>
                    <Status status={this.state.edition.status} />
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
                          <td className="labels"><b>Турнир</b></td>
                          <td>
                            <Link to={`/tournaments/view/${this.state.tournament.id}`}>
                              {this.state.tournament.name}
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td><b>Информация</b></td><td>{this.state.edition.info}</td>
                        </tr>
                        <tr>
                          <td><b>Начало</b></td><td>{dateString(this.state.edition.startDate)}</td>
                        </tr>
                        <tr>
                          <td><b>Край</b></td><td>{dateString(this.state.edition.endDate)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <SchemesTable schemes={this.state.schemes} />
        </Fragment>
      );
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.edition.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.edition.status === 'draft' ? <span className="button"><Link to={`/editions/edit/${this.state.edition.id}`}>Промяна</Link></span> : null}
        {this.state.edition.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </span>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}