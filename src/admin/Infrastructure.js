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

  component = (
    <div className="public container" onClick={(e) => e.stopPropagation()}>
      <div>Тази операция извършва промени по базата, моля потвърдете!</div>
      <div>
        <span className="button" onClick={() => this.close(true)}>Добре</span>
        <span className="button" onClick={() => this.close(false)}>Отказ</span>
      </div>
    </div>
  );

  open() {
    createOpenModalEvent(this.component, () => this.close(false));
  }

  close(accepted) {
    this.props.onChange(accepted);
    createCloseModalEvent();
  }

  render() {
    return (
      <span className={this.props.className}>
        <span className="button" onClick={() => this.open()}>{this.props.children}</span>
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
            <div className={"button" + (this.props.disabled ? " disabled" : "")} onClick={() => this.click(history)}>{this.props.children}</div>
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
        {this.state.items.map(item => <option key={item.id} value={item.id}>{item[this.props.selector ? this.props.selector : 'name']}</option>)}
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

export class ModalHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      component: null,
      _close_handle: null
    };
  }

  componentDidMount() {
    const modal = document.getElementById("modal");
    modal.addEventListener("open-modal", (ev) => {
      let data = ev.detail;
      this.setState({
        isOpened: true,
        component: data.component,
        _close_handle: data.onClose
      });
    });

    modal.addEventListener("close-modal", (ev) => {
      this.setState({
        isOpened: false, component: null, _close_handle: null
      })
    });
  }

  close() {
    this.state._close_handle();
    this.setState({ isOpened: false, component: null, _close_handle: null });
  }

  render() {
    return (
      <div id="modal">
        {this.state.isOpened ?
          <div className="backdrop fade-in" onClick={() => this.close()}>
            {this.state.component}
          </div> : null
        }
      </div>
    );
  }
}

export function createOpenModalEvent(component, onClose) {
  const modal = document.getElementById("modal");
  const e = new CustomEvent("open-modal", { detail: { component, onClose } });
  modal.dispatchEvent(e);
}

export function createCloseModalEvent() {
  const modal = document.getElementById("modal");
  const e = new CustomEvent("close-modal");
  modal.dispatchEvent(e);
}