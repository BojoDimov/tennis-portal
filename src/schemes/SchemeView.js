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
import { BracketStatus, ApplicationMode } from '../enums';
import { catchEvent } from '../services/events.service';
import MessageModal from '../components/MessageModal';
import ScoresModal from './components/ScoresModal';

class SchemeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scheme: {
        edition: {}
      },
      schemeModel: null,
      enrolled: [],
      hasError: false,
      scores: null
    }
  }

  componentDidMount() {
    this.getData();
    catchEvent('logged-in', () => {
      this.getData();
    })
  }

  getData() {
    const { id } = this.props.match.params;

    QueryService
      .get(`/schemes/${id}`)
      .then(e => this.setState({ scheme: e }));

    QueryService
      .get('/users/enrollments')
      .then(enrolled => this.setState({ enrolled }));
  }

  deleteScheme() {
    this.setState({ hasError: false });
    return QueryService.delete(`/schemes/${this.state.scheme.id}`)
      .then(e => this.props.history.replace(`/editions/${this.state.scheme.edition.id}`))
      .catch(err => this.setState({ hasError: true }));
  }

  drawBracket() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/drawBracket`)
      .then(() => this.getData());
  }

  getScores() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/scores`)
      .then(scores => this.setState({ scores }));
  }

  render() {
    const { scheme, schemeModel, enrolled, scores } = this.state;

    return (
      <UserService.WithApplicationMode>
        {mode => {
          let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

          return (
            <div className="container">
              <MessageModal activation={this.state.hasError}>
                <Typography>Неуспешно изтриване на схема. Възможна причина за грешката е съществуващи записи на играчи.</Typography>
              </MessageModal>
              {hasPermission && schemeModel
                && <SchemeFormModal
                  model={schemeModel}
                  onChange={() => {
                    this.setState({ schemeModel: null });
                    this.getData();
                  }}
                  onClose={() => this.setState({ schemeModel: null })}
                />}
              {scores && scores.length > 0
                && <ScoresModal
                  scores={scores}
                  scheme={scheme}
                  onChange={() => {
                    this.setState({ scores: null });
                    this.getData();
                  }}
                  onClose={() => this.setState({ scores: null })}
                />}

              {hasPermission &&
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

                  {scheme.bracketStatus == BracketStatus.ELIMINATION_END
                    && <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginLeft: '.3rem' }}
                      onClick={() => this.getScores()}
                    >
                      Резултати
                </Button>}

                  {scheme.bracketStatus == BracketStatus.UNDRAWN
                    && <ConfirmationDialog
                      title="Изтриване на турнир"
                      body={<Typography>Сигурни ли сте че искате да изтриете схема {scheme.name}?</Typography>}
                      onAccept={() => this.deleteScheme()}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: '.3rem' }}
                      >
                        Изтриване
                  </Button>
                    </ConfirmationDialog>}

                </div>}

              <SchemeDetails
                scheme={scheme}
                actions={
                  <SchemeDetailsActions mode={mode} scheme={scheme} reload={() => this.getData()} enrollment={enrolled[scheme.id]} />
                }
                enableEditionLink
              />
              <EnrollmentsComponent scheme={scheme} style={{ marginTop: '1rem' }} mode={mode} />
            </div>
          );
        }}
      </UserService.WithApplicationMode>
    );
  }
}

export default SchemeView;