import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status, ConfirmationButton } from '../Infrastructure';
import { SchemesPreview } from '../schemes/SchemesPreview';
import { updateBreadcrumb } from '../../public/Breadcrumb';

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
    this.getData()
      .then(() => updateBreadcrumb(this.getPath()));
  }

  getPath() {
    return [
      { title: this.state.Tournament.name, link: `/tournaments/view/${this.state.Tournament.id}` },
      { title: this.state.name, link: `/editions/view/${this.state.id}` },
    ]
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
        <SchemesPreview schemes={this.state.schemes} editionId={this.state.id} />
      </Fragment>
    );
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.status === 'draft' ? <ConfirmationButton onChange={flag => flag ? this.publish() : null}>Публикуване</ConfirmationButton> : null}
        {this.state.status === 'draft' ? <span className="button"><Link to={`/editions/edit/${this.state.id}`}>Промяна</Link></span> : null}
        {this.state.status === 'published' ? <ConfirmationButton onChange={flag => flag ? this.draft() : null}>Връщане в чернова</ConfirmationButton> : null}
      </span>
    );
  }
}

function dateString(str) {
  let date = new Date(str);
  return date.toLocaleDateString();
}