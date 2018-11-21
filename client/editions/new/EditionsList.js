import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import EditionFormModal from './EditionFormModal';
import EditionsDesktopView from './EditionsDesktopView';
import editionsViewActions from './EditionsViewActions';
import QueryService from '../services/query.service';

class EditionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: [],
      editionModel: null
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
    const { editions, editionModel } = this.state;
    const actions = editionsViewActions(this.handleOpenModal, this.handleRemoveEdition);

    return (
      <div className="container">
        {editionModel
          && <EditionFormModal
            model={editionModel}
            onChange={() => console.log('change')}
            onClose={() => this.setState({ editionModel: null })}
          />}

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