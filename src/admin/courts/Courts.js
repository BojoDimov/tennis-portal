import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import QueryService from '../../services/query.service';
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
      .get(`/schedule/courts`)
      .then(e => this.setState({ courts: e }));
  }

  updateModel(model, index) {
    const courts = this.state.courts;
    courts[index] = model;
    this.setState({ courts });
  }

  addCourt() {
    const courts = this.state.courts;
    if (courts.length > 0 && !courts[0].id)
      return;
    const court = {
      info: '',
      name: '',
      isActive: true,
      workingHoursStart: '',
      workingHoursEnd: ''
    };


    courts.unshift(court);

    this.setState({ courts: courts });
  }

  removeCourt(index) {
    const courts = this.state.courts;
    courts.splice(index, 1);
    this.setState({ courts: courts });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="container">
        <Button variant="contained" size="medium" color="primary" onClick={() => this.addCourt()} style={{ marginBottom: '.5rem' }}>
          Добави корт
        </Button>
        <div className={classes.root}>
          {this.state.courts.map((court, index) => {
            return (
              <CourtItem
                key={court.id || 0}
                court={court}
                onChange={model => this.updateModel(model, index)}
                onCreateCancel={() => this.removeCourt(index)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Courts);