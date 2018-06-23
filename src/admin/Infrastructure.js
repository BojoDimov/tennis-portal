import React from 'react';
import { Link, Route } from 'react-router-dom';
import { get } from '../services/fetch';

export class ConfirmationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
  }

  action(accepted) {
    this.setState({ opened: false });
    this.props.onChange(accepted);
  }

  render() {
    return (
      <span>
        <span className="button" onClick={() => this.setState({ opened: true })}>{this.props.children}</span>
        {this.state.opened ?
          <div className="backdrop fade-in" onClick={() => this.action(false)}>
            <div className="public container" onClick={(e) => e.stopPropagation()}>
              <div>Тази операция извършва промени по базата, моля потвърдете!</div>
              <div>
                <span className="button" onClick={() => this.action(true)}>Добре</span>
                <span className="button" onClick={() => this.action(false)}>Отказ</span>
              </div>
            </div>
          </div> : null}
      </span>
    );
  }
}

export class ActionButton extends React.Component {
  render() {
    return (
      <Route render={({ history }) => {
        return (
          <div className={this.props.className}>
            <div className="button" onClick={() => this.click(history)}>{this.props.children}</div>
          </div>
        );
      }} />
    );
  }

  click(history) {
    this.props.onClick()
      .then(() => history.push(this.props.onSuccess))
      .catch(() => { });
  }
}

export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  componentDidMount() {
    get(this.props.url).then(items => this.setState({ items }));
  }

  render() {
    return (
      <select onChange={(e) => this.props.onChange(this.state.items.find(i => i.id == e.target.value))} value={this.props.value}>
        {this.props.children}
        {this.state.items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select >
    );
  }
}

export const Status = ({ status }) => {
  const statusNames = {
    'draft': 'чернова',
    'published': 'активен',
    'inactive': 'неактивен'
  }
  return (
    // <span className={status}>{statusNames[status]}</span>
    <span className="info">{status === 'draft' ? '(' + (statusNames[status]) + ')' : null}</span>
  );
};