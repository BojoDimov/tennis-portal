import React from 'react';

export class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      opened: false
    };
  }

  componentDidMount() {
    let container = document.getElementById("messages");
    container.addEventListener('message', ev => {
      this.setState({ message: ev.detail, opened: true });
      setTimeout(() => {
        this.setState({ opened: false })
      }, 6000);
    });
  }

  render() {
    return (
      <div id="messages">
        {this.state.opened ?
          <div className="messages">
            <span className="icon-box"><i className="fas fa-check"></i></span>
            <span className="text-box">{this.state.message}</span>
          </div>
          : null}
      </div>);
  }
}