import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';

export class Enrollments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10
    }
  }
  render() {
    return (
      <div className="container">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Записани играчи</span>
              </th>
              <th className="text-right">
                Точки
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.enrollments.slice(0, this.state.limit).map((e, i) => (
              <tr key={e.id}>
                <td>
                  <span>{(i + 1) + '.'}</span><Link to={`/editions/view/${e.id}`} >{e.name}</Link>
                </td>
                <td className="text-right">
                  {e.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.props.enrollments.length == 0 ? <div><i>Няма записани играчи</i></div> : null}
        {this.state.limit != this.props.enrollments.length && this.props.enrollments.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: this.props.enrollments.length })}>
              покажи всичко
              </a>
          </div> : null}
        {this.state.limit == this.props.enrollments.length && this.props.enrollments.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: 10 })}>
              скрий
              </a>
          </div> : null}
      </div>
    );
  }
}

export class EnrollmentsQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10
    }
  }

  render() {
    return (
      <div className="container">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Опашка</span>
              </th>
              <th className="text-right">
                Точки
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.queue.slice(0, this.state.limit).map((e, i) => (
              <tr key={e.id}>
                <td>
                  <span>{(i + 1) + '.'}</span><Link to={`/editions/view/${e.id}`} >{e.name}</Link>
                </td>
                <td className="text-right">
                  {e.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.props.queue.length == 0 ? <div><i>Няма записани играчи в опашка</i></div> : null}
        {this.state.limit != this.props.queue.length && this.props.queue.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: this.props.queue.length })}>
              покажи всичко
              </a>
          </div> : null}
        {this.state.limit == this.props.queue.length && this.props.queue.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: 10 })}>
              скрий
              </a>
          </div> : null}
      </div>
    );
  }
}