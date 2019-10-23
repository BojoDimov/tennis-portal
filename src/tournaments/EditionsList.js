import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import TournamentFormModal from '../tournaments/TournamentFormModal';
import EditionFormModal from '../editions/EditionFormModal';
import EditionsListTile from './EditionsListTile';
import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import { catchEvent } from '../services/events.service';
import { ApplicationMode, Status } from '../enums';

class EditionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: [],
      editionModel: null,
      tournamentModel: null
    };
  }

  componentDidMount() {
    this.getData();
    catchEvent('logged-in', () => {
      this.getData();
    });
  }

  getData() {
    return QueryService
      .post(`/editions/filter`, {})
      .then(editions => this.setState({ editions }));
  }

  navigateToEdition(edition) {

  }

  render() {
    const { editions, editionModel, tournamentModel } = this.state;
    const { classes } = this.props;

    return (
      <UserService.WithApplicationMode>
        {mode => {
          let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

          return (
            <div className="container">
              {hasPermission && editionModel
                && <EditionFormModal
                  model={editionModel}
                  onChange={() => { this.setState({ editionModel: null }); this.getData(); }}
                  onClose={() => this.setState({ editionModel: null })}
                />}

              {hasPermission && tournamentModel
                && <TournamentFormModal
                  model={tournamentModel}
                  onChange={() => { this.setState({ tournamentModel: null }); this.getData(); }}
                  onClose={() => this.setState({ tournamentModel: null })}
                />}

              {hasPermission && <div style={{ margin: '.5rem 0' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.setState({ tournamentModel: { status: Status.DRAFT, name: '', info: '', thumbnailId: null } })}
                >
                  Нова Лига
                  </Button>

                <Button
                  style={{ marginLeft: '.3rem' }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.setState({ editionModel: { status: Status.DRAFT, name: '', info: '', startDate: null, endDate: null } })}
                >
                  Нов Турнир
                  </Button>
              </div>}

              <Paper className={classes.root}>
                <Typography variant="h5" className={classes.heading}>Турнири</Typography>
                {editions.map((edition) => <EditionsListTile key={edition.id} edition={edition} history={this.props.history} mode={mode} />)}
              </Paper>
            </div>
          );
        }}
      </UserService.WithApplicationMode>
    );
  }
}

const styles = (theme) => ({
  root: {
    padding: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '1em .5em'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '.5em .0'
    }
  },
  heading: {
    marginBottom: '.8em',
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  }
});

export default withStyles(styles)(EditionsList);