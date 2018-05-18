import React from 'react';
import { Link, Route } from 'react-router-dom';
import '../app/App.css';

export const ItemList = ({ match, items, name }) => {
  return (
    <div className="margin container-fluid">
      <h2 className="marign section">{name}
        <Link to={`${match.path}/create`}>
          <span className="button small"> добавяне</span>
        </Link>
      </h2>
      {items.length == 0 ? <i className="list-item-info">Няма намерени резултати</i> : null}
      {items.map(item => <ItemView match={match} key={item.id} item={item} />)}
    </div>
  )
};

export const ItemView = ({ match, item }) => {
  return (
    <Link to={`${match.path}/view/${item.id}`}>
      <div className="list-item">
        <div><span className="headline">{item.name}</span> <Status status={item.status} />
          {/* <span className="small">
            {item.status === 'draft' ? <span className="button ">промяна</span> : null}
            {item.status === 'draft' ? <span className="button ">публикуване</span> : null}
          </span> */}
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
  constructor(props) {
    super(props);
  }

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
      .then(() => history.push(this.props.onSuccess));
  }
}