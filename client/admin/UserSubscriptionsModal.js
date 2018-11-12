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
import { withStyles } from '@material-ui/core/styles';

import UserService from '../services/user.service';
import L10n from '../components/L10n';
import QueryService from '../services/query.service';
import UserModel from '../users/user.model';
import { SubscriptionType } from '../enums';
import ConfirmationDialog from '../components/ConfirmationDialog';
import EnumSelect from '../components/EnumSelect';

class UserSubscriptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administrator: UserService.getUser(),
      subscriptions: []
    };

    this.handleChange = (index) => (prop) => (e) => {
      const subscriptions = this.state.subscriptions;
      subscriptions[index][prop] = e.target.value;
      this.setState({ subscriptions });
    }

    this.handleDelete = (index) => () => {
      const subscriptions = this.state.subscriptions;
      subscriptions.splice(index, 1);
      this.setState({ subscriptions });
    }
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

  save() {
  }

  addSubscription() {
    const { subscriptions } = this.state;
    subscriptions.unshift({
      customerId: this.props.user.id,
      season: this.props.season,
      seasonId: this.props.season.id,
      administrator: this.state.administrator,
      totalHours: 0,
      usedHours: 0,
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
            key={index}
            model={sub}
            onChange={this.handleChange(index)}
            onDelete={this.handleDelete(index)}
          />)}

          {subscriptions.length == 0 && <Typography variant="caption">Няма регистрирани абонаменти</Typography>}
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.save()}>
            Запис
          </Button>
          <Button variant="outlined" color="primary" className={classes.btn} onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class Subscription extends React.Component {
  render() {
    const { model, onChange, onDelete } = this.props;

    return (
      <ExpansionPanel defaultExpanded={!model.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color="primary" style={{ flexBasis: '50%' }}>
            Абонамент
            <L10n
              style={{ marginLeft: '.3rem' }}
              type={SubscriptionType}
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

          <EnumSelect
            label="Тип абонамент"
            value={model.type}
            fullWidth={true}
            onChange={onChange('type')}
            EnumValues={SubscriptionType}
            EnumName="SubscriptionType"
          />

          <TextField
            label="Общо часове"
            type="number"
            value={model.totalHours}
            onChange={onChange('totalHours')}
            fullWidth={true}
          />

          <TextField
            label="Изиграни часове"
            type="number"
            value={model.usedHours}
            onChange={onChange('usedHours')}
            fullWidth={true}
          />

          <ConfirmationDialog
            title="Изтриване на абонамент"
            body={<Typography>Сигурни ли сте че искате да изтриете абонамента</Typography>}
            onAccept={onDelete}
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