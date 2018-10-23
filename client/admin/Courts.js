import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import CourtItem from './CourtItem';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});

class Courts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courts: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService
      .get(`/schedule/admin`)
      .then(e => this.setState(e));
  }

  updateModel(model, index) {
    const courts = this.state.courts;
    courts[index] = model;
    this.setState({ courts });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="container">
        <div className={classes.root}>
          {this.state.courts.map((court, index) => <CourtItem key={court.id} court={court} onChange={model => this.updateModel(model, index)} />)}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Courts);