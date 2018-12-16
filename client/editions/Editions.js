import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import FutureEditions from './FutureEditions';
import CurrentEditions from './CurrentEditions';
import PreviousEditions from './PreviousEditions';
import QueryService from '../services/query.service';
import UserService from '../services/user.service';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }
});

class Editions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousEditions: [
        { id: 1, tournament: { name: 'Лято 2018' }, name: 'Diana Summer N17', date: new Date() },
        { id: 2, tournament: { name: 'Лято 2018' }, name: 'Diana Summer N16', date: new Date() },
        { id: 3, tournament: { name: 'Лято 2018' }, name: 'Diana Summer N15', date: new Date() }
      ],
      currentEditions: [
        { id: 4, tournament: { name: 'Лято 2018' }, name: 'Diana Summer N18', date: new Date() }
      ],
      futureEditions: [
        { id: 5, tournament: { name: 'Лято 2018' }, name: 'Diana Summer N19', date: new Date() }
      ],
      isAdmin: UserService.isAdmin()
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const today = new Date();
    return QueryService
      .get('/editions')
      .then(editions => this.setState({
        previousEditions: editions.filter(e => new Date(e.endDate) < today),
        currentEditions: editions.filter(e => new Date(e.startDate) <= today && new Date(e.endDate) >= today),
        futureEditions: editions.filter(e => new Date(e.startDate) > today)
      }));
  }

  handleDelete(id) {
    return QueryService
      .delete(`/editions/${id}`)
      .then(e => this.getData());
  }

  render() {
    const { classes } = this.props;
    const { futureEditions, currentEditions, previousEditions, isAdmin } = this.state;

    return (
      <div className="container">
        {isAdmin && <div className="spacing">
          <Button variant="contained" size="small" color="primary">Добави издание</Button>
          <Button variant="contained" size="small" color="primary">Добави турнир</Button>
        </div>}
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Предстоящи турнири</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FutureEditions
              editions={futureEditions}
              canDelete={isAdmin}
              onDelete={this.handleDelete.bind(this)}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              Текущи турнири
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CurrentEditions
              editions={currentEditions}
              canDelete={isAdmin}
              onDelete={this.handleDelete.bind(this)}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Минали турнири</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <PreviousEditions
              editions={previousEditions}
              canDelete={isAdmin}
              onDelete={this.handleDelete.bind(this)}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div >
    );
  }
}

Editions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Editions);