import React from 'react';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'material-ui-pickers/DatePicker';

import EnumSelect from '../components/EnumSelect';
import { Gender, CourtType, PlayStyle, BackhandType } from '../enums';

class UserModel {
  constructor(props) {
    this.UserAccountData = this.UserAccountData.bind(this);
    this.UserPlayerMainData = this.UserPlayerMainData.bind(this);
    this.UserPlayerSecondaryData = this.UserPlayerSecondaryData.bind(this);
  }

  get() {
    return {
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
    };
  }

  composeErrors(errors, name) {
    if (errors[name])
      return <span>
        {Object.values(errors[name]).map((err, i) => {
          return (
            <span key={i} style={{ display: 'block' }}>{err}</span>
          );
        })}
      </span>
    else return null;
  }

  UserAccountData(props) {
    const { user, onChange, errors } = props;
    return (
      <React.Fragment>
        <TextField
          id="email"
          label="Email"
          value={user.email}
          required={true}
          fullWidth={true}
          error={Boolean(errors.email)}
          helperText={this.composeErrors(errors, 'email')}
          onChange={onChange('email')}
        />

        <TextField
          id="password"
          label="Парола"
          type="password"
          value={user.password}
          required={true}
          fullWidth={true}
          error={Boolean(errors.password)}
          helperText={this.composeErrors(errors, 'password')}
          onChange={onChange('password')}
        />

        <TextField
          id="confirmPassword"
          label="Повтори парола"
          type="password"
          value={user.confirmPassword}
          required={true}
          fullWidth={true}
          error={Boolean(errors.confirmPassword)}
          helperText={this.composeErrors(errors, 'confirmPassword')}
          onChange={onChange('confirmPassword')}
        />
      </React.Fragment>
    );
  }

  UserPlayerMainData(props) {
    const { user, onChange, errors } = props;
    return (
      <React.Fragment>
        <TextField
          label="Име"
          value={user.firstName}
          required={true}
          fullWidth={true}
          helperText={this.composeErrors(errors, 'firstName')}
          onChange={onChange('firstName')}
        />

        <TextField
          label="Фамилия"
          value={user.lastName}
          required={true}
          fullWidth={true}
          helperText={this.composeErrors(errors, 'lastName')}
          onChange={onChange('lastName')}
        />

        <DatePicker
          autoOk
          openToYearSelection
          label="Дата на раждане"
          clearable
          required={true}
          fullWidth={true}
          value={user.birthDate}
          helperText={this.composeErrors(errors, 'birthDate')}
          onChange={onChange('birthDate', true)}
        />

        <TextField
          label="Телефон"
          required={true}
          fullWidth={true}
          value={user.telephone}
          helperText={this.composeErrors(errors, 'telephone')}
          onChange={onChange('telephone')}
        />

        <EnumSelect
          label="Пол"
          value={user.gender}
          required={true}
          helperText={this.composeErrors(errors, 'gender')}
          onChange={onChange('gender')}
          EnumValues={Gender}
          EnumName="Gender" />
      </React.Fragment>
    );
  }

  UserPlayerSecondaryData(props) {
    const { user, onChange, errors } = props;
    return (
      <React.Fragment>
        <TextField
          id="startedPlaying"
          label="Започнах да играя през"
          fullWidth={true}
          value={user.startedPlaying}
          helperText={this.composeErrors(errors, 'startedPlaying')}
          onChange={onChange('startedPlaying')}
          type="number"
        />

        <EnumSelect
          label="Играя със"
          value={user.playStyle}
          helperText={this.composeErrors(errors, 'playStyle')}
          onChange={onChange('playStyle')}
          EnumValues={PlayStyle}
          EnumName="PlayStyle" />

        <EnumSelect
          label="Бекхенд"
          value={user.backhandType}
          helperText={this.composeErrors(errors, 'backhandType')}
          onChange={onChange('backhandType')}
          EnumValues={BackhandType}
          EnumName="BackhandType" />

        <EnumSelect
          label="Любима настилка"
          value={user.courtType}
          helperText={this.composeErrors(errors, 'courtType')}
          onChange={onChange('courtType')}
          EnumValues={CourtType}
          EnumName="CourtType" />
      </React.Fragment>
    );
  }
}

export default new UserModel();