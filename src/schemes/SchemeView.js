import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import EnrollmentsComponent from './components/Enrollments';
import SchemeDetails from './components/SchemeDetails';
import MatchesList from './components/MatchesList';
import SchemeActions from './components/SchemeActions';

class SchemeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scheme: {},
      isAdmin: UserService.isAdmin()
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { id } = this.props.match.params;

    return QueryService
      .get(`/schemes/${id}`)
      .then(e => this.setState({ scheme: e }));
  }

  render() {
    const { scheme, isAdmin, menuAnchor } = this.state;

    return (
      <div className="container">
        {isAdmin && <SchemeActions />}

        <SchemeDetails scheme={scheme} />

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Групова фаза</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Елиминация</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>

        <EnrollmentsComponent schemeId={scheme.id} />

        <MatchesList schemeId={scheme.id} />
      </div>
    );
  }
}

export default SchemeView;