import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import UserModel from '../users/user.model';
import QueryService from '../services/query.service';

const styles = (theme) => ({
  action: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center'
  },
  focused: {
    marginTop: '.5rem',
    color: 'orange'
  }
});

class RegistrationStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      completed: [false, false, false],
      user: UserModel.get(),
      errors: UserModel.getErrorsModel()
    }

    this.handleChange = (prop, custom = false) => (event) => {
      let user = this.state.user;
      user[prop] = (custom ? event : event.target.value);
      this.setState({
        user: user
      });
    }

    this.changeStep = (value) => () => {
      let completed = this.state.completed;
      completed[this.state.activeStep] = true;
      this.setState({ activeStep: value, completed: completed });
    }
  }

  register() {
    this.setState({ errors: UserModel.getErrorsModel() });
    return QueryService
      .post(`/users`, this.state.user)
      .then(_ => this.props.onSuccess())
      .catch(err => this.setState({ errors: err }));
  }

  render() {
    const { user, activeStep, completed, errors } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Stepper
          nonLinear
          activeStep={activeStep}
          orientation="vertical"
        >
          <Step>
            <StepLabel
              style={{ cursor: 'pointer' }}
              onClick={this.changeStep(0)}
              completed={completed[0]}
              error={errors.email.length
                + errors.password.length
                + errors.confirmPassword.length > 0}
            >
              Данни за акаунт
            </StepLabel>
            <StepContent>
              <UserModel.UserAccountData
                user={user}
                errors={errors}
                onChange={this.handleChange} />

              <StepActions
                activeStep={activeStep}
                finalStep={2}
                className={classes.action}
                changeStep={this.changeStep} />
            </StepContent>
          </Step>
          <Step>
            <StepLabel
              style={{ cursor: 'pointer' }}
              completed={completed[1]}
              onClick={this.changeStep(1)}
              error={errors.firstName.length
                + errors.lastName.length
                + errors.telephone.length
                + errors.gender.length
                + errors.birthDate.length > 0}
            >
              Основни данни за играч
            </StepLabel>
            <StepContent>
              <UserModel.UserPlayerMainData
                user={user}
                errors={errors}
                onChange={this.handleChange} />

              <StepActions
                activeStep={activeStep}
                finalStep={2}
                className={classes.action}
                changeStep={this.changeStep} />
            </StepContent>
          </Step>
          <Step>
            <StepLabel
              style={{ cursor: 'pointer' }}
              onClick={this.changeStep(2)}
              completed={completed[2]}
              error={errors.startedPlaying.length
                + errors.playStyle.length
                + errors.courtType.length
                + errors.backhandType.length > 0}
            >
              Допълнителни данни за играч
            </StepLabel>
            <StepContent>
              <UserModel.UserPlayerSecondaryData
                user={user}
                errors={errors}
                onChange={this.handleChange} />

              <StepActions
                activeStep={activeStep}
                finalStep={2}
                className={classes.action}
                changeStep={this.changeStep} />
            </StepContent>
          </Step>
        </Stepper>

        {activeStep === 3 && <div>
          <em>
            Натискайки бутонът "Регистрация" Вие се съгласявате да получавате съобщения относно
            статуса на турнири за които сте записани, както и при нужда да бъдете потърсени по
            телефонния номер който сте задали.
          </em>
          <div className={classes.action}>
            <Button variant="outlined" color="primary" size="small" onClick={this.changeStep(0)}>
              Промяна
          </Button>

            <Button style={{ marginLeft: '.3rem' }} variant="contained" size="small" color="primary" onClick={() => this.register()}>
              Регистрация
          </Button>
          </div>
        </div>
        }
      </React.Fragment>
    );
  }
}

class StepActions extends React.Component {
  render() {
    const { activeStep, changeStep, finalStep, className } = this.props;

    return (
      <div className={className}>
        {activeStep != 0 && <Button
          variant="outlined"
          color="primary"
          size="small"
          disabled={activeStep === 0}
          onClick={changeStep(activeStep - 1)}
        >
          Назад
          </Button>}

        <Button
          style={{ marginLeft: '.3rem' }}
          variant="contained"
          color="primary"
          size="small"
          onClick={changeStep(activeStep + 1)}
        >
          {activeStep === finalStep ? 'Приключване' : 'Продължи'}
        </Button>
      </div>
    );
  }
}


export default withStyles(styles)(RegistrationStepper);