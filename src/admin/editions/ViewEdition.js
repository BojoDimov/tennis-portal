import React, { Component, Fragment } from 'react';
import { get } from '../../services/fetch';
import { Status, ItemList } from '../Infrastructure';

export class ViewEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      edition: {},
      schemes: [],
      loading: true
    };
  }
  componentDidMount() {
    // get(`/editions/${this.props.match.params.id}`)
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
            <h2 className="section"><span>{this.state.edition.name}</span> <Status status={this.state.edition.status} /></h2>
            <p>{this.state.edition.info}</p>
          </div>
          <ItemList items={this.state.schemes} name="Схеми" match={{ path: '/schemes' }} />
          <div className="margin container-fluid">
            <h2 className="section"><span>Ранглиста</span></h2>
          </div>
        </Fragment>
      );
  }
}