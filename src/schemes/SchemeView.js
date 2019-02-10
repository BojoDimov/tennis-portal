import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ConfirmationDialog from '../components/ConfirmationDialog';
import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import EnrollmentsComponent from './components/Enrollments';
import SchemeFormModal from './SchemeFormModal';
import SchemeDetails from './components/SchemeDetails';
import SchemeDetailsActions from './components/SchemeDetailsActions';
import { BracketStatus } from '../enums';

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

  drawBracket() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/drawBracket`)
      .then(() => this.getData());
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
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => this.setState({ schemeModel: scheme })}
          >
            Промяна
          </Button>
          {scheme.bracketStatus != BracketStatus.ELIMINATION_END
            && <ConfirmationDialog
              title="Изтегляне/приключване на текуща фаза"
              body={<Typography>Сигурни ли сте че искате да извършите действието?</Typography>}
              onAccept={() => this.drawBracket()}
              style={{ marginTop: '.5rem' }}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: '.3rem' }}
              >
                {scheme.bracketStatus == BracketStatus.UNDRAWN
                  && <span>Изтегляне</span>}
                {(scheme.bracketStatus == BracketStatus.GROUPS_DRAWN || scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN)
                  && <span>Приключване на фаза</span>}
                {scheme.bracketStatus == BracketStatus.GROUPS_END
                  && <span>Следваща фаза</span>}
              </Button>
            </ConfirmationDialog>}

          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: '.3rem' }}
          >
            Изтриване
          </Button>
        </div>

        <SchemeDetails scheme={scheme} actions={actions} enableEditionLink />
        <EnrollmentsComponent scheme={scheme} style={{ marginTop: '1rem' }} />
      </div>
    );
  }
}

export default SchemeView;