import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { ConfirmationButton } from '../Infrastructure';
import { post } from '../../services/fetch';

export class UserSearchComponent extends React.Component {
  remove(userId) {
    post(`/user-edit/${userId}/remove`)
      .then(e => this.props.onChange(e));
  }

  render() {
    let users = this.props.users;

    return (
      <div className="container">
        <table className="list-table" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '20rem' }}>
                <span>Потребител</span>
              </th>
              <th>
                Активен
              </th>
              <th>
                Администратор
              </th>
              <th>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(e => (
              <tr key={e.id}>
                <td>
                  <Link to={`/users/${e.id}`} >{e.name}</Link>
                  <div>({e.email})</div>
                </td>
                <td>
                  {e.isActive ? <span>Да</span> : <span>Не</span>}
                </td>
                <td>
                  {e.isAdmin ? <span>Да</span> : <span>Не</span>}
                </td>
                <td style={{ textAlign: 'right' }} className="button-group">
                  <Link to={`/users/${e.id}/edit`} className="button">
                    <i className="fas fa-wrench"></i>
                  </Link>
                  <ConfirmationButton className="danger"
                    onChange={flag => flag ? this.remove(e.id) : null} >
                    <i className="fas fa-trash-alt"></i>
                  </ConfirmationButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}