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
import SchemeFormModal from './SchemeFormModal';
import SchemeDetails from './components/SchemeDetails';
import SchemeDetailsActions from './components/SchemeDetailsActions';
import MatchesList from './components/MatchesList';

class SchemeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scheme: {
        edition: {}
      },
      schemeModel: null
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

  deleteScheme() {
    return QueryService.delete(`/schemes/${this.state.scheme.id}`)
      .then()
  }

  render() {
    const { scheme, schemeModel } = this.state;
    const actions = <SchemeDetailsActions scheme={scheme} />

    return (
      <div className="container">
        {schemeModel
          && <SchemeFormModal
            model={schemeModel}
            onChange={() => {
              this.setState({ schemeModel: null });
              this.getData();
            }}
            onClose={() => this.setState({ schemeModel: null })}
          />}

        <div style={{ margin: '.5rem 0' }}>
          <Button variant="contained" color="primary" size="small" onClick={() => this.setState({ schemeModel: scheme })}>Промяна</Button>
          <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '.3rem' }}>Изтриване</Button>
        </div>

        <SchemeDetails scheme={scheme} actions={actions} enableEditionLink />
        <EnrollmentsComponent scheme={scheme} style={{ marginTop: '1rem' }} />

        {/* <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Групова фаза</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="title">Елиминация</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel> */}

        {/*
        <MatchesList schemeId={scheme.id} /> */}
      </div>
    );
  }
}

export default SchemeView;