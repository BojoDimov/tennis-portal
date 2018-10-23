import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../services/query.service';
import UserModel from './user.model';

const styles = (theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1rem'
  }
});

class UsersCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserModel.get(),
      errors: {}
    }

    this.handleChange = (prop, custom = false) => (event) => {
      let user = this.state.user;
      user[prop] = (custom ? event : event.target.value);
      this.setState({
        user: user
      });
    }
  }


  render() {
    const { user, errors } = this.state;
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Нов играч</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div style={{ marginBottom: '1rem' }}>
            <UserModel.UserAccountData
              user={user}
              errors={errors}
              onChange={this.handleChange} />

            <UserModel.UserPlayerMainData
              user={user}
              errors={errors}
              onChange={this.handleChange} />

            <UserModel.UserPlayerSecondaryData
              user={user}
              errors={errors}
              onChange={this.handleChange} />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.save()}
            >
              Създай
          </Button>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(UsersCreate);