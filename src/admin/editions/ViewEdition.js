import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status } from '../Infrastructure';
import { SchemesPreview } from '../schemes/SchemesPreview';

export class ViewEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Tournament: {

      },
      schemes: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return get(`/editions/${this.props.match.params.id}`)
      .then(res => this.setState(res));
  }

  publish() {
    get(`/editions/${this.state.id}/publish`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/editions/${this.state.id}/draft`)
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
                        <td className="labels"><b>Турнир</b></td>
                        <td>
                          <Link to={`/tournaments/view/${this.state.Tournament.id}`}>
                            {this.state.Tournament.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Информация</b></td><td>{this.state.info}</td>
                      </tr>
                      <tr>
                        <td><b>Начало</b></td><td>{dateString(this.state.startDate)}</td>
                      </tr>
                      <tr>
                        <td><b>Край</b></td><td>{dateString(this.state.endDate)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <SchemesPreview schemes={this.state.schemes} />
      </Fragment>
    );
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.status === 'draft' ? <span className="button"><Link to={`/editions/edit/${this.state.id}`}>Промяна</Link></span> : null}
        {this.state.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
      </span>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}