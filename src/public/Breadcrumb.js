import React from 'react';
import { Link } from 'react-router-dom';

export class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        { title: '', link: '/' }
      ],
      current: []
    }
  }

  componentDidMount() {
    window.onpopstate = function (event) {
      console.log("location: " + document.location.pathname + ", state: " + JSON.stringify(event.state));
    };

    let breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.addEventListener('breadcrumb', ev => {
      console.log(ev.detail);
      this.setState({ history: this.state.history.concat([ev.detail]), current: ev.detail });
    });
  }

  navigate(i) {
    console.log('navigating');
  }

  home() {
    this.setState({ current: [] });
  }

  render() {
    return (
      <div id="breadcrumb">
        <Link onClick={() => this.home()} to="/"><i className="fas fa-home"></i></Link>
        {this.state.current.map((s, i) => (
          <React.Fragment key={i}>
            <span>{" / "}</span>
            <Link onClick={() => this.navigate(i)} to={s.link}>{s.title}</Link>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export function updateBreadcrumb(data) {
  let breadcrumb = document.getElementById("breadcrumb");
  let ev = new CustomEvent('breadcrumb', { detail: data });
  breadcrumb.dispatchEvent(ev);
}