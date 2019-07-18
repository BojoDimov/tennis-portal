import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';

import UserService from '../../services/user.service';
import L10n from '../../components/L10n';
import QueryService from '../../services/query.service';
import { SubscriptionType } from '../../enums';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EnumSelect from '../../components/EnumSelect';

class UserSubscriptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administrator: null,
      subscriptions: []
    };

    this.handleChange = (index) => (newValue) => {
      const subscriptions = this.state.subscriptions;
      subscriptions[index] = newValue
      this.setState({ subscriptions });
      this.props.onChange(subscriptions);
    }

    this.handleDelete = (index) => () => {
      const subscriptions = this.state.subscriptions;
      subscriptions.splice(index, 1);
      this.setState({ subscriptions });
      this.props.onChange(subscriptions);
    }
  }

  componentDidMount() {
    UserService.getAuthenticatedUser()
      .then(user => this.setState({ administrator: user }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user != this.props.user && this.props.user != null)
      this.init();
  }

  init() {
    this.setState({
      subscriptions: JSON.parse(JSON.stringify(this.props.user.subscriptions))
    });
  }

  addSubscription() {
    const { subscriptions } = this.state;
    if (subscriptions.length > 0 && !subscriptions[0].id)
      return;

    subscriptions.unshift({
      customerId: this.props.user.id,
      season: this.props.season,
      seasonId: this.props.season.id,
      administrator: this.state.administrator,
      totalHours: 0,
      remainingHours: 0,
      type: ''
    });

    this.setState(subscriptions);
  }

  render() {
    const { isOpen, user, onClose, classes, fullScreen } = this.props;
    const { subscriptions } = this.state;

    if (!this.props.user)
      return null;

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <DialogContentText variant="headline">
            Абонаменти на {user.name}
          </DialogContentText>
        </DialogTitle>
        <DialogContent >
          <Button variant="contained" color="primary" size="small"
            style={{ marginBottom: '1rem' }}
            onClick={() => this.addSubscription()}
          >
            Добави абонамент
          </Button>

          {subscriptions.map((sub, index) => <Subscription
            key={sub.id || 0}
            model={sub}
            onChange={this.handleChange(index)}
            onDelete={this.handleDelete(index)}
          />)}

          {subscriptions.length == 0 && <Typography variant="caption">Няма регистрирани абонаменти</Typography>}
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          {/* <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.save()}>
            Запис
          </Button> */}
          <Button variant="outlined" color="primary" size="small" className={classes.btn} onClick={onClose}>
            <ArrowBackIcon />
            Назад
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administrator: {},
      season: {},
      type: '',
      totalHours: 0,
      remainingHours: 0,
      isEditMode: false,
      expanded: false
    }
  }

  componentDidMount() {
    this.setState({
      ...JSON.parse(JSON.stringify(this.props.model)),
      isEditMode: !this.props.model.id,
      expanded: !this.props.model.id
    });
  }

  save() {
    let query = null
    if (this.state.id)
      query = QueryService
        .post(`/subscriptions/${this.state.id}`, this.state);
    else
      query = QueryService
        .post(`/subscriptions`, this.state)

    return query
      .then(e => {
        this.props.onChange(e);
        this.setState({ ...e, isEditMode: false });
      })
      .catch(err => this.setState({ errors: err }));
  }

  remove() {
    return QueryService
      .delete(`/subscriptions/${this.state.id}`)
      .then(_ => this.props.onDelete())
      .catch(err => this.setState({ errors: err }));
  }

  cancelEdit() {
    if (!this.state.id)
      return this.props.onDelete();
    else
      return this.setState({
        ...JSON.parse(JSON.stringify(this.props.model)),
        isEditMode: false
      });
  }

  render() {
    const model = this.state;

    return (
      <ExpansionPanel expanded={model.expanded}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => this.setState({ expanded: !model.expanded })}
        >
          <Typography color="primary" style={{ flexBasis: '50%' }}>
            Абонамент
            <L10n
              style={{ marginLeft: '.3rem' }}
              translate="SubscriptionType"
            >
              {model.type}
            </L10n>
          </Typography>
          <Typography color="textSecondary">{model.season.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
          <Typography variant="caption">
            Администрирал:
            <Typography>{model.administrator.name}</Typography>
          </Typography>

          {!this.state.isEditMode && <React.Fragment>
            <Typography variant="caption">
              Тип абонамент:
              <Typography>
                <L10n
                  translate="SubscriptionType"
                >
                  {model.type}
                </L10n>
              </Typography>
            </Typography>

            <Typography variant="caption">
              Общо часове:
              <Typography>{model.totalHours}</Typography>
            </Typography>

            <Typography variant="caption">
              Оставащи часове
              <Typography>{model.remainingHours}</Typography>
            </Typography>
          </React.Fragment>}

          {this.state.isEditMode && <React.Fragment>
            <EnumSelect
              label="Тип абонамент"
              value={model.type}
              fullWidth={true}
              onChange={(e) => this.setState({ type: e.target.value })}
              EnumValues={SubscriptionType}
              EnumName="SubscriptionType"
            />

            <TextField
              label="Общо часове"
              type="number"
              value={model.totalHours}
              onChange={(e) => this.setState({ totalHours: e.target.value })}
              fullWidth={true}
            />

            <Typography variant="caption" style={{ marginTop: '.5rem' }}>
              Оставащи часове (ще бъде обновено след запис)
              <Typography>{model.remainingHours}</Typography>
            </Typography>
          </React.Fragment>}

          {this.state.isEditMode && <div style={{ marginTop: '.5rem' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginRight: '.3rem' }}
              onClick={() => this.save()}
            >
              Запис
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => this.cancelEdit()}
            >
              Отказ
            </Button>
          </div>}

          {!this.state.isEditMode && <div style={{ marginTop: '.5rem' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginRight: '.3rem' }}
              onClick={() => this.setState({ isEditMode: true })}
            >
              Редакция
            </Button>

            <ConfirmationDialog
              title="Изтриване на абонамент"
              body={<Typography>Сигурни ли сте че искате да изтриете абонамента</Typography>}
              onAccept={() => this.remove()}
              style={{ marginTop: '.5rem' }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="small"
              >
                Изтриване
            </Button>
            </ConfirmationDialog>
          </div>}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '600px',
    padding: '0'
  },
  btnContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '.3rem',
      width: '100%'
    }
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(UserSubscriptionsModal)
);