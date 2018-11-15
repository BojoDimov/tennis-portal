import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import UserService from '../services/user.service';
import QueryService from '../services/query.service';
import { l10n_text } from '../components/L10n';
import { ReservationType, SubscriptionType } from '../enums';
import { getHour } from '../utils';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: UserService.getUser(),
      user: {},
      subscriptions: null,
      reservations: null,
      subsCollapsed: true,
      resCollapsed: false
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const id = this.props.match.params.id || this.state.loggedInUser.id;
    return QueryService
      .get(`/users/${id}`)
      .then(e => this.setState(e));
  }

  render() {
    const { user, reservations, subscriptions, subsCollapsed, resCollapsed } = this.state;
    const { mode, classes } = this.props;

    return (
      <div className="container">
        <Card classes={{ root: classes.sectionRoot }}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Typography classes={{ root: classes.sectionHeadline }} variant="headline">{user.name}</Typography>
            {/* <Typography variant="caption">
              E-mail
              <Typography>{user.email}</Typography>
            </Typography> */}
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>

        {reservations != null && <Card classes={{ root: classes.sectionRoot }}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Typography
              variant="headline"
              classes={{ root: classes.sectionHeadline }}
              onClick={() => this.setState({ resCollapsed: !resCollapsed })}
            >
              <span>Резервации</span>
              {resCollapsed && <ExpandLessIcon />}
              {!resCollapsed && <ExpandMoreIcon />}
            </Typography>
            {resCollapsed
              && <React.Fragment>
                <List>
                  {reservations.map(reservation => {
                    return (
                      <Typography classes={{ root: classes.listItemRoot }} key={reservation.id}>
                        {l10n_text(reservation.type, ReservationType, "CustomReservationType")}
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
              {subsCollapsed && <ExpandLessIcon />}
              {!subsCollapsed && <ExpandMoreIcon />}
            </Typography>
            {subsCollapsed
              && <React.Fragment>
                <List>
                  {subscriptions.map(subscription => {
                    return (
                      <Typography classes={{ root: classes.listItemRoot }} key={subscription.id}>
                        Абонамент {l10n_text(subscription.type, SubscriptionType, "SubscriptionType")}
                        <Typography component="span" variant="caption" style={{ display: 'inline', marginLeft: '1rem' }}>{subscription.season.name}</Typography>
                        <Typography component="span" variant="caption">{subscription.usedHours}/{subscription.totalHours}</Typography>
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

export default withStyles(styles)(UserProfile);