import React, { Component, Fragment } from 'react';
import { get } from '../../services/fetch';
import { Status, ItemList } from '../Infrastructure';

export class ViewScheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      edition: {},
      scheme: {},
      loading: true
    };
  }
  componentDidMount() {
    // get(`/schemes/${this.props.match.params.id}`)
    //   .then(res => {
    //     console.log(res);
    //     res.loading = false;
    //     this.setState(res);
    //   });
  }

  render() {
    if (this.loading)
      return (<div>Loading...</div>);
    else
      return (
        <Fragment>
          <div className="margin container-fluid">
            <h2 className="section"><span>{this.state.scheme.name}</span> <Status status={this.state.scheme.status} /></h2>
            <p>{this.state.scheme.info}</p>
          </div>
          <div className="margin container-fluid">
            <h2 className="section"><span>Ранглиста</span></h2>
          </div>
        </Fragment>
      );
  }
}