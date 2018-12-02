import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TournamentFormModal from '../../tournaments/TournamentFormModal';
import EditionFormModal from './EditionFormModal';
import EditionsDesktopView from './EditionsDesktopView';
import EditionsMobileView from './EditionsMobileView';
import editionsViewActions from './EditionsViewActions';
import QueryService from '../../services/query.service';

class EditionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: [],
      editionModel: null,
      tournamentModel: null
    }

    this.handleOpenModal = (editionModel) => {
      this.setState({ editionModel });
    }

    this.handleRemoveEdition = (edition) => {

    }
  }

  componentDidMount() {
    this.filter();
  }

  filter() {
    return QueryService
      .post(`/editions/filter`, {})
      .then(editions => this.setState({ editions }));
  }

  render() {
    const { editions, editionModel, tournamentModel } = this.state;
    const actions = editionsViewActions(this.handleOpenModal, this.handleRemoveEdition);

    return (
      <div className="container">
        {editionModel
          && <EditionFormModal
            model={editionModel}
            onChange={() => console.log('change')}
            onClose={() => this.setState({ editionModel: null })}
          />}

        {tournamentModel
          && <TournamentFormModal
            model={tournamentModel}
            onChange={() => this.setState({ tournamentModel: null })}
            onClose={() => this.setState({ tournamentModel: null })}
          />}

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => this.setState({ tournamentModel: { name: '', info: '', thumbnailId: null } })}
        >
          Нова Лига
        </Button>

        <Button
          style={{ marginLeft: '.3rem' }}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => this.setState({ editionModel: { name: '', info: '', startDate: null, endDate: null } })}
        >
          Нов Турнир
        </Button>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Турнири</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Hidden smDown>
              <EditionsDesktopView editions={editions} actions={actions} />
            </Hidden>

            <Hidden mdUp>
              <EditionsMobileView editions={editions} actions={actions} />
            </Hidden>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default EditionsList;