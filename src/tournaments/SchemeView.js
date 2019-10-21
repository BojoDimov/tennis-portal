import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import { ApplicationMode, BracketStatus } from '../enums';
import { catchEvent } from '../services/events.service';
import SchemeFormModal from '../schemes/SchemeFormModal';
import MessageModal from '../components/MessageModal';
import ScoresModal from '../schemes/components/ScoresModal';
import EliminationPreviewModal from '../schemes/components/EliminationPreviewModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import styles from './scheme.styles';
import {
  SchemeInfoBar,
  RegisterWidget,
  SchemesWidget,
  EnrollmentsWidget,
  FinalMatchWidget
} from './scheme.components';

class SchemeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: {
        edition: {
          tournament: {}
        },
        matches: [{
          team1: {
            user1: {},
            user2: {}
          },
          team2: {
            user1: {},
            user2: {}
          },
          sets: []
        }]
      },
      schemeModel: null,
      enrolled: [],
      hasError: false,
      scores: null,
      eliminationPreview: null,
      currentUser: null
    }

    this.onCompleteRegisterAction = (action) => {
      if (action === 'enroll')
        return () => {
          this.getData();
        }
      else
        return () => {
          this.getData();
        }
    }

    this.onErrorRegisterAction = (action) => {
      if (action === 'enroll')
        return () => {

        }
      else
        return () => {

        }
    }
  }

  componentDidMount() {
    UserService.getAuthenticatedUser()
      .then(currentUser => this.setState({ currentUser }));
  }

  render() {
    const { scheme, schemeModel, enrolled, scores, eliminationPreview } = this.state;
    const { classes, history } = this.props;

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

              {eliminationPreview && <EliminationPreviewModal
                teams={eliminationPreview}
                scheme={scheme}
                onClose={() => this.setState({ eliminationPreview: null })}
                onDraw={() => this.setState({ eliminationPreview: null }, this.getData())}
              />}

              {hasPermission && this.getButtons()}


              <Paper className={classes.root}>
                <Typography className={classes.heading}>{scheme.name}</Typography>
                <SchemeInfoBar scheme={scheme} playerCount={enrolled.length} classes={classes} />
                <Typography style={{ marginBottom: '1em' }}>{scheme.info}</Typography>
                <div className={classes.widgets_root}>
                  {/* && scheme.bracketSize == scheme.matches[0].round */}
                  {scheme.matches && scheme.matches[0]
                    && <div style={{ width: '100%', marginBottom: '1em' }}>
                      <FinalMatchWidget match={scheme.matches[0]} classes={classes} scheme={scheme} />
                    </div>}
                  <div className={classes.widgets_second_row}>
                    <div className="left">
                      {scheme.bracketStatus == BracketStatus.UNDRAWN && <div style={{ marginBottom: '1em' }}>
                        <RegisterWidget
                          scheme={scheme}
                          classes={classes}
                          enrollment={this.getCurrentUserEnrollment()}
                          mode={mode}
                          onComplete={this.onCompleteRegisterAction}
                          onError={this.onErrorRegisterAction}
                        />
                      </div>}
                      <div>
                        <SchemesWidget scheme={scheme} classes={classes} history={history} />
                      </div>
                    </div>
                    <div className="right">
                      <EnrollmentsWidget scheme={scheme} mode={mode} classes={classes} enrolled={enrolled} />
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          );
        }}
      </UserService.WithApplicationMode>
    );
  }

  getCurrentUserEnrollment() {
    const { currentUser, enrolled } = this.state;

    if (!currentUser)
      return null;
    else
      return enrolled.find(e => e.team1Id == currentUser.teamId || e.team2Id == currentUser.teamId);
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
      .get(`/schemes/${id}/enrollments`)
      .then(enrolled => this.setState({ enrolled }));
  }

  deleteScheme() {
    this.setState({ hasError: false });
    return QueryService.delete(`/schemes/${this.state.scheme.id}`)
      .then(e => this.props.history.replace(`/editions/${this.state.scheme.edition.id}`))
      .catch(err => this.setState({ hasError: true }));
  }

  getScores() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/scores`)
      .then(scores => this.setState({ scores }));
  }

  previewElimination() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/draw/eliminationPhase/preview`)
      .then(eliminationPreview => this.setState({ eliminationPreview }));
  }

  drawGroupPhase() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/draw/groupPhase`)
      .then(() => this.getData());
  }

  finishPhase() {
    return QueryService.get(`/schemes/${this.state.scheme.id}/draw/finish`)
      .then(() => this.getData());
  }

  getButtons() {
    const { scheme } = this.state;

    return (
      <div style={{ margin: '.5rem 0' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => this.setState({ schemeModel: scheme })}
        >
          Промяна
        </Button>

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

        {((scheme.bracketStatus == BracketStatus.UNDRAWN && !scheme.hasGroupPhase)
          || (scheme.bracketStatus == BracketStatus.GROUPS_END))
          && <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: '.3rem' }}
            onClick={() => this.previewElimination()}
          >
            Изтегляне
        </Button>}

        {scheme.bracketStatus == BracketStatus.UNDRAWN && scheme.hasGroupPhase
          && <ConfirmationDialog
            title="Изтегляне на схема"
            body={<Typography>Сигурни ли сте, че искате да изтеглите схемата?</Typography>}
            onAccept={() => this.drawGroupPhase()}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: '.3rem' }}
            >
              Изтегляне
            </Button>
          </ConfirmationDialog>}

        {(scheme.bracketStatus == BracketStatus.GROUPS_DRAWN || scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN)
          && <ConfirmationDialog
            title="Приключване на фаза"
            body={<Typography>Сигурни ли сте че искате да приключите текущата фаза?</Typography>}
            onAccept={() => this.finishPhase()}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: '.3rem' }}
            >
              Приключване на фаза
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
      </div>
    );
  }
}

export default withStyles(styles)(SchemeView);