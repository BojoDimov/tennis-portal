import React from 'react';
import { get } from '../services/fetch';
import './fast-styles.css';
import * as UserService from '../services/user';

export default class Schemes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserService.getUser(),
      schemes: []
    }
  }

  componentDidMount() {
    get(`/editions/${this.props.match.params['id']}`)
      .then(edition => this.setState({ schemes: edition.schemes }));
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container list">
          {this.state.schemes.map(this.getScheme.bind(this))}
        </div>
      </div>
    );
  }

  getScheme(scheme, i) {
    const [errors, messages] = validateEnroll(this.state.user, scheme);
    console.log(errors, messages);
    return (
      <div className="button list-row" key={i}>
        <img src="../images/smile-logo.jpg" />
        <div>
          <div className="list-row-header">{scheme.name}</div>
          <div style={{ fontWeight: 700 }}>{getLocaleDate(scheme.date)}</div>
        </div>

        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          {getLimitations(scheme)}
        </div>

        <div style={{ padding: '1rem' }}>
          <div>Записване</div>
          <div>{getLocaleDate(scheme.registrationStart)} - {getLocaleDate(scheme.registrationEnd)}</div>
        </div>

        <div>
          {errors.length == 0 && messages.length == 0 ?
            <span className="special-button g">Записване</span>
            : null}

          {errors.length == 0 && messages.find(m => m.type == 'reg-end') ?
            <span className="special-button b" title={messages.find(m => m.type == 'reg-end').message}>Записване</span>
            : null}

          {errors.length > 0 ?
            <span className="special-button disabled" title={null}>Записване</span>
            : null}
        </div>
      </div>
    );
  }
}

function validateEnroll(user, scheme) {
  const errors = [];
  const messages = [];
  const age = new Date(new Date() - new Date(user.birthDate)).getUTCFullYear - 1970;

  if (new Date() < new Date(scheme.registrationStart))
    messages.push({ type: 'reg-start', message: 'регистрацията не е отворена' });

  if (new Date() > new Date(scheme.registrationEnd))
    messages.push({ type: 'reg-end', message: 'регистрацията е приключила, ще бъдете записан в опашка' });

  if (scheme.singleTeams) {
    if (!scheme[user.gender + 'Teams'])
      errors.push('пол');

    if ((scheme.ageFrom && scheme.ageFrom > age) || (scheme.ageTo && scheme.ageTo < age))
      errors.push('възраст');
  }

  return [errors, messages];
}

function getLimitations(scheme) {
  const limitations = [];
  if (scheme.singleTeams)
    limitations.push('SGL ' + getSize(scheme));
  else
    limitations.push('DBL ' + getSize(scheme));
  if (scheme.maleTeams)
    limitations.push('M');
  if (scheme.femaleTeams)
    limitations.push('F');
  if (scheme.mixedTeams)
    limitations.push('Mixed');
  if (scheme.ageFrom || scheme.ageTo)
    limitations.push(scheme.ageFrom + ' - ' + scheme.ageTo);

  return limitations.join(' | ');
}

function getSize(scheme) {
  if (scheme.schemeType == 'elimination')
    return scheme.maxPlayerCount;
  else return scheme.groupCount * scheme.teamsPerGroup;
}


function canEnroll(user, scheme) {
  if (scheme.singleTeams) {
    return scheme[user.gender + 'Teams'];
  }
}

function getLocaleDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}