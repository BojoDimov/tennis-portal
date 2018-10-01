import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui-pickers/DatePicker';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import EnumSelect from '../components/EnumSelect';
import { Gender, CourtType, PlayStyle, BackhandType } from '../enums';

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
      user: {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        telephone: '',
        gender: '',
        birthDate: null,
        startedPlaying: '',
        playStyle: '',
        courtType: '',
        backhandType: ''
      },
      errors: {}
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

    this.getErrors = (name) => {
      if (this.state.errors[name])
        return <span>
          {Object.values(this.state.errors[name]).map((err, i) => {
            return (
              <span key={i} style={{ display: 'block' }}>{err}</span>
            );
          })}
        </span>
      else return null;
    }
  }

  register() {
    this.setState({
      errors: {
        email: {
          invalid: 'Невалиден имейл.',
          unique: 'Съществува потребител с такъв имейл.'
        },
        password: {
          length: 'Паролата трябва да бъде поне 6 символа.'
        },
        confirmPassword: {
          mismatch: 'Паролите не свъпадат.'
        }
      }
    })
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
              onClick={this.changeStep(0)}
              completed={completed[0]}
              error={Boolean(errors.email) || Boolean(errors.password) || Boolean(errors.confirmPassword)} >
              Данни за акаунт
            </StepLabel>
            <StepContent>
              <TextField
                id="email"
                label="Email"
                value={user.email}
                required={true}
                fullWidth={true}
                error={Boolean(errors.email)}
                helperText={this.getErrors('email')}
                onChange={this.handleChange('email')}
              />

              <TextField
                id="password"
                label="Парола"
                type="password"
                value={user.password}
                required={true}
                fullWidth={true}
                error={Boolean(errors.password)}
                helperText={this.getErrors('password')}
                onChange={this.handleChange('password')}
              />

              <TextField
                id="confirmPassword"
                label="Повтори парола"
                type="password"
                value={user.confirmPassword}
                required={true}
                fullWidth={true}
                error={Boolean(errors.confirmPassword)}
                helperText={this.getErrors('confirmPassword')}
                onChange={this.handleChange('confirmPassword')}
              />

              <StepActions
                activeStep={activeStep}
                finalStep={2}
                className={classes.action}
                changeStep={this.changeStep} />
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={this.changeStep(1)} completed={completed[1]}>
              Основни данни за играч
            </StepButton>
            <StepContent>
              <TextField
                label="Име"
                value={user.firstName}
                required={true}
                fullWidth={true}
                onChange={this.handleChange('firstName')}
              />

              <TextField
                label="Фамилия"
                value={user.lastName}
                required={true}
                fullWidth={true}
                onChange={this.handleChange('lastName')}
              />

              <DatePicker
                autoOk
                openToYearSelection
                label="Дата на раждане"
                clearable
                required={true}
                fullWidth={true}
                value={user.birthDate}
                onChange={this.handleChange('birthDate', true)}
              />

              <TextField
                label="Телефон"
                required={true}
                fullWidth={true}
                value={user.telephone}
                onChange={this.handleChange('telephone')}
              />

              <EnumSelect
                label="Пол"
                value={user.gender}
                required={true}
                onChange={this.handleChange('gender')}
                EnumValues={Gender}
                EnumName="Gender" />

              <StepActions
                activeStep={activeStep}
                finalStep={2}
                className={classes.action}
                changeStep={this.changeStep} />
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={this.changeStep(2)} completed={completed[2]}>
              Допълнителни данни за играч
            </StepButton>
            <StepContent>
              <TextField
                id="startedPlaying"
                label="Започнах да играя през"
                fullWidth={true}
                value={user.startedPlaying}
                onChange={this.handleChange('startedPlaying')}
                type="number"
              />

              <EnumSelect
                label="Играя със"
                value={user.playStyle}
                onChange={this.handleChange('playStyle')}
                EnumValues={PlayStyle}
                EnumName="PlayStyle" />

              <EnumSelect
                label="Бекхенд"
                value={user.backhandType}
                onChange={this.handleChange('backhandType')}
                EnumValues={BackhandType}
                EnumName="BackhandType" />

              <EnumSelect
                label="Любима настилка"
                value={user.courtType}
                onChange={this.handleChange('courtType')}
                EnumValues={CourtType}
                EnumName="CourtType" />

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
            <Button variant="text" onClick={this.changeStep(0)}>
              Промяна
          </Button>

            <Button variant="contained" color="primary" onClick={() => this.register()}>
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
          disabled={activeStep === 0}
          onClick={changeStep(activeStep - 1)}
        >
          Назад
          </Button>}

        <Button
          variant="text"
          color="primary"
          onClick={changeStep(activeStep + 1)}
        >
          {activeStep === finalStep ? 'Приключване' : 'Продължи'}
        </Button>
      </div>
    );
  }
}


export default withStyles(styles)(RegistrationStepper);