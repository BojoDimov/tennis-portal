import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import { l10n_text } from '../components/L10n';
import { getHour } from '../utils';
import { UserPersonalInfo, UserPlayerInfo } from './UserProfile';
import UserProfileFormModal from './UserProfileFormModal';
import ChangePasswordModal from './ChangePasswordModal'
import InvitationsComponent from './InvitationsComponent';

class AccountView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      user: {},
      subscriptions: null,
      reservations: null,
      invitations: null,
      subsCollapsed: true,
      resCollapsed: true,
      invCollapsed: true,
      userModel: null,
      changePassword: false
    }
  }

  componentDidMount() {
    this.setUser()
      .then(() => this.getData());
  }

  setUser() {
    return UserService.getAuthenticatedUser()
      .then(user => this.setState({ loggedInUser: user }));
  }

  getData() {
    const id = this.props.match.params.id || this.state.loggedInUser.id;

    if (!this.props.match.params.id || this.props.match.params.id == this.state.loggedInUser.id)
      QueryService.get('/invitations')
        .then(invitations => this.setState({ invitations }));

    QueryService
      .get(`/users/${id}`)
      .then(e => this.setState(e));
  }

  render() {
    const {
      user,
      userModel,
      reservations,
      subscriptions,
      invitations,
      subsCollapsed,
      resCollapsed,
      invCollapsed,
      changePassword
    } = this.state;
    const { mode, classes } = this.props;

    return (
      <div className="container">
        {userModel
          && <UserProfileFormModal
            model={userModel}
            onChange={() => { this.getData(); this.setState({ userModel: null }) }}
            onClose={() => this.setState({ userModel: null })}
          />}

        {changePassword && <ChangePasswordModal onClose={() => this.setState({ changePassword: false })} />}

        <Card classes={{ root: classes.sectionRoot }}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Typography classes={{ root: classes.sectionHeadline }} variant="headline">{user.name}</Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <UserPersonalInfo user={user} />
              <UserPlayerInfo user={user} style={{ marginLeft: '2rem' }} />
            </div>
            <div>
              <Button variant="contained" size="small" color="primary" onClick={() => this.setState({ userModel: Object.assign({}, user) })}>Промяна</Button>
              <Button variant="contained" size="small" color="primary" style={{ marginLeft: '.3rem' }} onClick={() => this.setState({ changePassword: true })}>Смяна на парола</Button>
            </div>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>

        {invitations && <Card classes={{ root: classes.sectionRoot }}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Typography
              variant="headline"
              classes={{ root: classes.sectionHeadline }}
              onClick={() => this.setState({ invCollapsed: !invCollapsed })}
            >
              <span>Покани за турнири</span>
              {invCollapsed && <ExpandLessIcon />}
              {!invCollapsed && <ExpandMoreIcon />}
            </Typography>
            {invCollapsed && <InvitationsComponent invitations={this.state.invitations} onChange={() => this.getData()} />}
          </CardContent>
        </Card>}

        {reservations != null && <Card classes={{ root: classes.sectionRoot }}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Typography
              variant="headline"
              classes={{ root: classes.sectionHeadline }}
              onClick={() => this.setState({ resCollapsed: !resCollapsed })}
            >
              <span>Резервации</span>
              <Typography component="em">
                Дължим брой часове: {user.reservationDebt}
              </Typography>
              {resCollapsed && <ExpandLessIcon />}
              {!resCollapsed && <ExpandMoreIcon />}
            </Typography>
            {resCollapsed
              && <React.Fragment>
                <List>
                  {reservations.map(reservation => {
                    return (
                      <Typography classes={{ root: classes.listItemRoot }} key={reservation.id}>
                        {l10n_text(reservation.type, "CustomReservationType")}
                        <Typography component="span" variant="caption" style={{ display: 'inline', marginLeft: '1rem' }}>{reservation.court.name}</Typography>
                        {!reservation.isActive && <Typography component="span" color="secondary">ОТМЕНЕНО</Typography>}
                        <Typography component="span" variant="caption">
                          {reservation.season.name}
                          <span style={{ marginLeft: '1rem' }}>{new Date(reservation.date).toLocaleDateString()}</span>
                          <span style={{ marginLeft: '1rem' }}>
                            {getHour(reservation.hour)} - {getHour(reservation.hour + 1)}
                          </span>
                        </Typography>
                      </Typography>
                    );
                  })}
                </List>
                {reservations.length == 0 && <Typography variant="caption">Няма регистрирани резервации.</Typography>}
              </React.Fragment>}
          </CardContent>
        </Card>}

        {subscriptions != null && <Card classes={{ root: classes.sectionRoot }}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Typography
              variant="headline"
              classes={{ root: classes.sectionHeadline }}
              onClick={() => this.setState({ subsCollapsed: !subsCollapsed })}
            >
              <span>Абонаменти</span>
              <Typography component="em">
                Дължим членски внос: {user.subscriptionDebt}лв.
              </Typography>
              {subsCollapsed && <ExpandLessIcon />}
              {!subsCollapsed && <ExpandMoreIcon />}
            </Typography>
            {subsCollapsed
              && <React.Fragment>
                <List>
                  {subscriptions.map(subscription => {
                    return (
                      <Typography classes={{ root: classes.listItemRoot }} key={subscription.id}>
                        Абонамент {l10n_text(subscription.type, "SubscriptionType")}
                        <Typography component="span" variant="caption" style={{ display: 'inline', marginLeft: '1rem' }}>{subscription.season.name}</Typography>
                        <Typography component="span" variant="caption">{subscription.remainingHours} оставащи часове</Typography>
                      </Typography>
                    );
                  })}
                </List>
                {subscriptions.length == 0 && <Typography variant="caption">Няма регистрирани абонаменти.</Typography>}
              </React.Fragment>}
          </CardContent>
        </Card>}
      </div>
    );
  }
}

const styles = (theme) => ({
  sectionRoot: {
    marginBottom: '1rem'
  },
  cardContentRoot: {
    '&:last-child': {
    }
  },
  sectionHeadline: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between'
  },
  listItemRoot: {
    padding: '.3rem 0',
    borderBottom: '1px solid lightgrey'
  }
});

export default withStyles(styles)(AccountView);