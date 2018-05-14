import React from 'react';
import { Link } from 'react-router-dom';
import '../app/App.css';

export const ItemList = ({ match, items, name }) => {
  return (
    <div className="margin container">
      <h2 className="marign section">{name}
        <Link to={`${match.path}/create`}>
          <span className="margin-left button small">{'+'}</span>
        </Link>
      </h2>
      {items.map(item => <ItemView match={match} key={item.id} item={item} />)}
    </div>
  )
};

export const ItemView = ({ match, item }) => {
  return (
    <Link to={`${match.path}/view/${item.id}`}>
      <div className="list-item">
        <div><span className="headline">{item.name}</span> <Status status={item.status} /></div>
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