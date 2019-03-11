import React from 'react';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { BracketStatus, ApplicationMode } from '../../enums';

import MessageModal from '../../components/MessageModal';
import { dispatchEvent } from '../../services/events.service';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import QueryService from '../../services/query.service';
import InvitationsModal from './InvitationsModal';

class SchemeDetailsActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasEnrolled: false,
      hasCancelledEnrollment: false,
      invitationsModal: false,
      error: null,
      hasEnrollmentError: false
    }
  }

  enroll() {
    this.setState({
      hasEnrolled: false,
      hasEnrollmentError: false
    });

    if (this.props.mode == ApplicationMode.GUEST)
      dispatchEvent('menu-login');
    else {
      return QueryService
        .get(`/schemes/${this.props.scheme.id}/enrollments/enroll`)
        .then(e => {
          this.setState({ hasEnrolled: true });
          this.props.reload();
        })
        .catch(() => this.setState({ hasEnrollmentError: true }));
    }
  }

  cancelEnroll() {
    return QueryService
      .delete(`/schemes/${this.props.scheme.id}/enrollments/${this.props.enrollment.id}/cancelEnroll`)
      .then(e => {
        this.setState({ hasCancelledEnrollment: true });
        this.props.reload();
      });
  }

  registrationOpen() {
    return moment().isBetween(moment(this.props.scheme.registrationStart), moment(this.props.scheme.registrationEnd));
  }

  render() {
    const { scheme, enableViewLink, enrollment } = this.props;
    return (
      <React.Fragment>
        <MessageModal activation={this.state.hasEnrolled}>
          <Typography>Записване за турнир {this.props.scheme.name} беше успешно.</Typography>
        </MessageModal>
        <MessageModal activation={this.state.hasEnrollmentError}>
          <Typography>Неуспешно записване за турнир {this.props.scheme.name}.
          Не отговаряте на изискванията за пол и/или възраст за тази схема.
          Моля ако не сте въвели тези данни в профила си, да ги въведете, защото те са задължителни за участие в турнирите.
          </Typography>
        </MessageModal>
        <MessageModal activation={this.state.hasCancelledEnrollment}>
          <Typography>Отписването от турнир {this.props.scheme.name} беше успешно.</Typography>
        </MessageModal>
        <MessageModal activation={this.state.error}>
          <Typography variant="subheading">Възникна грешка при записване за турнир {this.props.scheme.name}!</Typography>
          <Typography>{this.state.error}</Typography>
        </MessageModal>
        {this.state.invitationsModal
          && <InvitationsModal
            onChange={() => {
              this.props.reload();
              this.setState({ invitationsModal: false });
            }}
            onClose={() => this.setState({ invitationsModal: false })}
            scheme={this.props.scheme}
          />}
        {enableViewLink &&
          <Link to={`/schemes/${scheme.id}`}>
            <Button color="primary">Преглед</Button>
          </Link>}
        {scheme.bracketStatus == BracketStatus.GROUPS_DRAWN
          && <Link to={`/schemes/${scheme.id}/groups`}>
            <Button color="primary">Групи</Button>
          </Link>}
        {(scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN || scheme.bracketStatus == BracketStatus.ELIMINATION_END)
          && <React.Fragment>
            <Link to={`/schemes/${scheme.id}/elimination`}>
              <Button color="primary">Схема</Button>
            </Link>
            {scheme.hasGroupPhase
              && <Link to={`/schemes/${scheme.id}/groups`}>
                <Button color="primary">Групи</Button>
              </Link>}
          </React.Fragment>}
        {scheme.bracketStatus == BracketStatus.UNDRAWN
          && <React.Fragment>
            {!enrollment && this.registrationOpen()
              && <React.Fragment>
                {scheme.singleTeams && <Button color="primary" onClick={() => this.enroll()}>Записване</Button>}
                {!scheme.singleTeams && <Button color="primary" onClick={() => this.setState({ invitationsModal: true })}>Записване</Button>}
              </React.Fragment>}
            {enrollment && <ConfirmationDialog
              title="Отписване от турнир"
              body={<Typography>
                Сигурни ли сте че искате да се отпишете от турнир {this.props.scheme.name}?
                <Typography variant="caption">Ако сте в отбор, то и другият играч ще бъде отписан.</Typography>
              </Typography>}
              onAccept={() => this.cancelEnroll()}
            >
              <Button color="secondary">Отписване</Button>
            </ConfirmationDialog>}
          </React.Fragment>}
      </React.Fragment>
    );
  }
}

export default SchemeDetailsActions;