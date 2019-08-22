import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import SeasonItem from './SeasonItem';
import QueryService from '../../services/query.service';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
});

class Seasons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seasons: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService
      .get(`/schedule/seasons`)
      .then(e => this.setState({ seasons: e }));
  }

  updateModel(model, index) {
    const seasons = this.state.seasons;
    seasons[index] = model;
    this.setState({ seasons });
  }

  addSeason() {
    const seasons = this.state.seasons;
    if (seasons.length > 0 && !seasons[0].id)
      return;

    const season = {
      info: '',
      name: '',
      workingHoursStart: '',
      workingHoursEnd: ''
    };

    seasons.unshift(season);
    this.setState({ seasons });
  }

  removeSeason(index) {
    const seasons = this.state.seasons;
    seasons.splice(index, 1);
    this.setState({ seasons });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="container">
        <Button variant="contained" size="medium" color="primary" onClick={() => this.addSeason()} style={{ marginBottom: '.5rem' }}>
          Добави сезон
        </Button>
        <div className={classes.root}>
          {this.state.seasons.map((season, index) => {
            return (
              <SeasonItem
                key={season.id || 0}
                season={season}
                onChange={model => this.updateModel(model, index)}
                onCreateCancel={() => this.removeSeason(index)}
                refresh={() => this.getData()}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Seasons);