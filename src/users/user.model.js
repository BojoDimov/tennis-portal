import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DatePicker from 'material-ui-pickers/DatePicker';

import EnumSelect from '../components/EnumSelect';
import { Gender, CourtType, PlayStyle, BackhandType } from '../enums';

class UserModel {
  constructor(props) {
    this.UserAccountData = this.UserAccountData.bind(this);
    this.UserAccountSecondaryData = this.UserAccountSecondaryData.bind(this);
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
      backhandType: '',
      reservationDebt: 0,
      subscriptionDebt: 0
    };
  }

  getErrorsModel() {
    return {
      email: [],
      password: [],
      confirmPassword: [],
      firstName: [],
      lastName: [],
      telephone: [],
      gender: [],
      birthDate: [],
      startedPlaying: [],
      playStyle: [],
      courtType: [],
      backhandType: [],
      reservationDebt: [],
      subscriptionDebt: []
    };
  }

  composeErrors(errors, name) {
    if (errors[name].length > 0)
      return <span>
        {errors[name].map((err, i) => {
          return (
            <span
              key={i}
              style={{ display: 'block' }}
            >
              {UET[name][err]}
            </span>
          );
        })}
      </span>
    else
      return null;
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
          error={errors.email.length > 0}
          helperText={this.composeErrors(errors, 'email')}
          onChange={onChange('email')}
        />

        {!user.id && <TextField
          id="password"
          label="Парола"
          type="password"
          value={user.password}
          required={true}
          fullWidth={true}
          error={errors.password.length > 0}
          helperText={this.composeErrors(errors, 'password')}
          onChange={onChange('password')}
        />}

        {!user.id && <TextField
          id="confirmPassword"
          label="Повтори парола"
          type="password"
          value={user.confirmPassword}
          required={true}
          fullWidth={true}
          error={errors.confirmPassword.length > 0}
          helperText={this.composeErrors(errors, 'confirmPassword')}
          onChange={onChange('confirmPassword')}
        />}
      </React.Fragment>
    );
  }

  UserAccountSecondaryData(props) {
    const { user, onChange, errors } = props;
    return (
      <React.Fragment>
        <TextField
          id="reservationDebt"
          label="Дължим брой часове"
          type="number"
          value={user.reservationDebt}
          fullWidth={true}
          error={errors.reservationDebt.length > 0}
          helperText={this.composeErrors(errors, 'reservationDebt')}
          onChange={onChange('reservationDebt')}
        />

        <TextField
          id="reservationDebt"
          label="Дължим членски внос"
          type="number"
          value={user.subscriptionDebt}
          fullWidth={true}
          InputProps={{
            endAdornment: <InputAdornment position="end">Лв.</InputAdornment>
          }}
          error={errors.subscriptionDebt.length > 0}
          helperText={this.composeErrors(errors, 'subscriptionDebt')}
          onChange={onChange('subscriptionDebt')}
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
          error={errors.firstName.length > 0}
          helperText={this.composeErrors(errors, 'firstName')}
          onChange={onChange('firstName')}
        />

        <TextField
          label="Фамилия"
          value={user.lastName}
          required={true}
          fullWidth={true}
          error={errors.lastName.length > 0}
          helperText={this.composeErrors(errors, 'lastName')}
          onChange={onChange('lastName')}
        />

        <TextField
          label="Телефон"
          required={true}
          fullWidth={true}
          value={user.telephone}
          error={errors.telephone.length > 0}
          helperText={this.composeErrors(errors, 'telephone')}
          onChange={onChange('telephone')}
        />
      </React.Fragment>
    );
  }

  UserPlayerSecondaryData(props) {
    const { user, onChange, errors } = props;
    return (
      <React.Fragment>
        <DatePicker
          autoOk
          openToYearSelection
          label="Дата на раждане"
          labelFunc={(date) => date ? new Date(date).toLocaleDateString() : ''}
          clearable
          required={true}
          fullWidth={true}
          value={user.birthDate}
          error={errors.birthDate.length > 0}
          helperText={this.composeErrors(errors, 'birthDate')}
          onChange={onChange('birthDate', true)}
        />

        <EnumSelect
          label="Пол"
          value={user.gender}
          required={true}
          error={errors.gender.length > 0}
          errorText={this.composeErrors(errors, 'gender')}
          onChange={onChange('gender')}
          EnumValues={Gender}
          EnumName="Gender" />

        <TextField
          id="startedPlaying"
          label="Започнах да играя през"
          fullWidth={true}
          value={user.startedPlaying}
          error={errors.startedPlaying.length > 0}
          helperText={this.composeErrors(errors, 'startedPlaying')}
          onChange={onChange('startedPlaying')}
          type="number"
        />

        <EnumSelect
          label="Играя със"
          value={user.playStyle}
          error={errors.playStyle.length > 0}
          errorText={this.composeErrors(errors, 'playStyle')}
          onChange={onChange('playStyle')}
          EnumValues={PlayStyle}
          EnumName="PlayStyle" />

        <EnumSelect
          label="Бекхенд"
          value={user.backhandType}
          error={errors.backhandType.length > 0}
          errorText={this.composeErrors(errors, 'backhandType')}
          onChange={onChange('backhandType')}
          EnumValues={BackhandType}
          EnumName="BackhandType" />

        <EnumSelect
          label="Любима настилка"
          value={user.courtType}
          error={errors.courtType.length > 0}
          errorText={this.composeErrors(errors, 'courtType')}
          onChange={onChange('courtType')}
          EnumValues={CourtType}
          EnumName="CourtType" />
      </React.Fragment>
    );
  }
}

//User Errors Transliteration
const UET = {
  email: {
    required: 'Задължително поле',
    invalid: 'Невалиден имейл',
    unique: 'Съществува потребител с такъв имейл'
  },
  password: {
    required: 'Задължително поле',
    short: 'Паролата трябва да бъде поне 6 символа'
  },
  confirmPassword: {
    required: 'Задължително поле',
    mismatch: 'Паролите не свъпадат'
  },
  firstName: {
    required: 'Задължително поле',
  },
  lastName: {
    required: 'Задължително поле',
  },
  telephone: {
    required: 'Задължително поле',
    invalid: 'Невалиден телефонен номер'
  },
  gender: {
    required: 'Задължително поле',
    invalid: 'Невалиден пол'
  },
  birthDate: {
    invalid: 'Невалидна дата на раждане',
    required: 'Задължително поле',
  },
  startedPlaying: {
    invalid: 'Невалидна година',
    future: 'Годината не може да е в бъдещето',
    range: 'Годината не може да е преди датата на раждане'
  },
  playStyle: {
    invalid: 'Невалидно поле'
  },
  courtType: {
    invalid: 'Невалидно поле'
  },
  backhandType: {
    invalid: 'Невалидно поле'
  }
};

export default new UserModel();