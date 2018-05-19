import React from 'react';
import { Link, Route } from 'react-router-dom';
import '../app/App.css';

export class ItemList extends React.Component {
  render() {
    return (
      <div className="margin container-fluid">
        <h2 className="marign section">{this.props.name}
          <Link to={{ pathname: `${this.props.match.path}/create`, search: this.props.rootQuery }}>
            <span className="button small"> добавяне</span>
          </Link>
        </h2>
        {this.props.items.length === 0 ? <i className="list-item-info">Няма намерени резултати</i> : null}
        {this.props.items.map(item => <ItemView match={this.props.match} key={item.id} item={item} />)}
      </div>
    );
  }
}

export const ItemView = ({ match, item }) => {
  return (
    <Link to={`${match.path}/view/${item.id}`}>
      <div className="list-item">
        <div><span className="headline">{item.name}</span> <Status status={item.status} />
        </div>
        <div className="list-item-info">{item.info}</div>
      </div>
    </Link>
  );
};

export const Status = ({ status }) => {
  const statusNames = {
    'draft': 'чернова',
    'published': 'активен',
    'inactive': 'неактивен'
  }
  return (
    <span className={'status-' + status}>{statusNames[status]}</span>
  );
};

export class ActionButton extends React.Component {
  render() {
    return (
      <Route render={({ history }) => {
        return (
          <div className={this.props.className}>
            <span className="button" onClick={() => this.click(history)}>{this.props.children}</span>
          </div>
        );
      }} />
    );
  }

  click(history) {
    this.props.onClick()
      .then(({ error }) => {
        if (!error)
          history.push(this.props.onSuccess)
      });
  }
}