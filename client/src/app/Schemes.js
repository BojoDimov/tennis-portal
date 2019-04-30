import React from 'react';
import { Link } from 'react-router-dom';
import { get } from '../services/fetch';
import { ConfirmationButton, AccommodationMessage, createOpenModalEvent, CancelEnrollMessage } from './Infrastructure';
import './fast-styles.css';
import * as UserService from '../services/user';
import * as Enums from '../enums';
import Queries from '../services/queries';

export default class Schemes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserService.getUser(),
      schemes: [],
      edition: {},
      enrolled: []
    }
  }

  componentDidMount() {
    Queries.Schemes
      .get(this.props.match.params['id'])
      .then(res => this.setState(res));
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container list">
          <header className="major">
            <Link to="/accommodation" className="special-button b" style={{ width: '16rem' }} >
              Такси и записване</Link>
          </header>
          <h2>{this.state.edition.name}</h2>
          {this.state.schemes.map(this.getScheme.bind(this))}
        </div>
      </div >
    );
  }

  enroll(scheme) {
    get(`/schemes/${scheme.id}/enroll?userId=${this.state.user.id}`)
      .then(() => {
        this.setState({ enrolled: this.state.enrolled.concat([scheme.id]) });
        createOpenModalEvent(<AccommodationMessage />, () => null);
      });
  }

  cancelEnroll(scheme) {

    get(`/schemes/${scheme.id}/cancelEnroll?userId=${this.state.user.id}`)
      .then(() => {
        let ei = this.state.enrolled.indexOf(scheme.id);
        let enrolled = this.state.enrolled;
        enrolled.splice(ei, 1);
        return this.setState({ enrolled: enrolled })
      });
  }

  getScheme(scheme, i) {
    const button = this.getButton(scheme);

    return (
      <div className="button list-row" key={i} >
        <img src="../images/smile-logo.jpg" />
        <div style={{ flexBasis: '16rem', flexGrow: 1, cursor: 'pointer' }}
          onClick={() => this.props.history.push(`/schemes/${scheme.id}`)}>
          <div className="list-row-header"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span style={{ flexBasis: '8em' }}>{scheme.name}</span>
            <span style={{ textAlign: 'center', fontSize: '1rem', marginLeft: '1rem' }}>
              {getLimitations(scheme)}
            </span>
          </div>
          <span style={{ fontSize: '.9em' }}>{scheme.info}</span>
        </div>



        <SchemeInfo scheme={scheme} />

        <div style={{ width: '10rem' }}>
          {button ?
            <ConfirmationButton message={button.message}
              confirm={button.confirm}
              onChange={flag => flag ? button.onClick() : null} >
              <span className={`special-button ${button.class}`}
                title={button.title}>{button.name}</span>
            </ConfirmationButton>
            : null}
        </div>

        {/* <div style={{ width: '10rem' }}>
          {button ?
            <span className={`special-button ${button.class}`}
              title={button.title}
              onClick={button.onClick}>{button.name}</span>
            : null} */}

      </div>
    );
  }

  getButton(scheme) {
    let button = null;
    if (!this.state.user && scheme.status != Enums.Status.FINALIZED)
      return {
        confirm: false,
        message: null,
        title: null,
        name: 'Схема',
        class: 'b',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.props.history.push(`/schemes/${scheme.id}`);
        }
      }

    if (!this.state.user)
      return {
        confirm: false,
        message: null,
        title: null,
        name: 'Преглед',
        class: 'b',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.props.history.push(`/schemes/${scheme.id}`);
        }
      }

    const age = new Date(new Date() - new Date(this.state.user.birthDate)).getUTCFullYear() - 1970;

    if (scheme.status == Enums.Status.FINALIZED || scheme.hasGroupPhase)
      return {
        confirm: false,
        message: null,
        title: null,
        name: 'Преглед',
        class: 'b',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.props.history.push(`/schemes/${scheme.id}`);
        }
      }

    if (new Date(scheme.registrationStart) > new Date())
      return {
        confirm: false,
        message: null,
        title: 'Записването още не е започнало',
        name: 'Записване',
        class: 'disabled',
        onClick: (e) => {
          if (e)
            e.stopPropagation()
        }
      }

    if (this.state.enrolled.find(e => e == scheme.id))
      return {
        confirm: true,
        message: <CancelEnrollMessage name={scheme.name} />,
        title: null,
        name: 'Отписване',
        class: 'default',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.cancelEnroll(scheme)
        }
      }

    //двойки
    if (!scheme.singleTeams
      && (scheme.mixedTeams || scheme[this.state.user.gender + 'Teams']))
      return {
        confirm: false,
        message: null,
        title: null,
        name: 'Записване',
        class: 'g',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.props.history.push(`/schemes/${scheme.id}/invite`);
        }
      }

    if (scheme[this.state.user.gender + 'Teams']
      && (!scheme.ageFrom || scheme.ageFrom <= age)
      && (!scheme.ageTo || scheme.ageTo > age)) {
      if (new Date() > new Date(scheme.registrationEnd))
        return {
          confirm: false,
          message: null,
          title: null,
          name: 'Схема',
          class: 'b',
          onClick: (e) => {
            if (e)
              e.stopPropagation();
            return this.props.history.push(`/schemes/${scheme.id}`);
          }
        }
      else
        return {
          confirm: true,
          message: `Сигурни ли сте че искате да се запишете за турнир "${scheme.name}"?`,
          title: null,
          name: 'Записване',
          class: 'g',
          onClick: (e) => {
            if (e)
              e.stopPropagation();
            return this.enroll(scheme)
          }
        }
    }
    else
      return {
        confirm: false,
        message: null,
        title: null,
        name: 'Схема',
        class: 'b',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.props.history.push(`/schemes/${scheme.id}`);
        }
      }
  }
}

export class SchemeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: {
        user1: {}
      }
    }
  }

  componentDidMount() {
    if (this.props.scheme.status == Enums.Status.FINALIZED)
      get(`/schemes/${this.props.scheme.id}/winner`)
        .then(e => this.setState({ winner: e }));
  }

  render() {
    let scheme = this.props.scheme;
    if (scheme.status == Enums.Status.FINALIZED)
      return (
        <div style={{ padding: '1rem', width: '14rem', fontSize: '.9em' }}>
          <div>{`Победител${!scheme.singleTeams ? 'и:' : ':'}`}</div>
          <Link style={{ display: 'block', border: 'none' }}
            to={`/users/${this.state.winner.user1Id}`}>{this.state.winner.user1.name}</Link>
          {this.state.winner.user2 ?
            <Link style={{ display: 'block', border: 'none' }}
              to={`/users/${this.state.winner.user2Id}`}>{this.state.winner.user2.name}</Link>
            : null}
        </div>
      );
    else if (scheme.groupPhase)
      return (
        <div style={{ padding: '1rem', width: '14rem', fontSize: '.9em' }}>
          {/* <div>Участват първите двама от група</div>
          <Link to={`/schemes/${scheme.groupPhaseId}`} style={{ border: 'none' }}>{scheme.groupPhase.name}</Link> */}
        </div>
      );
    else
      return (
        <div style={{ padding: '1rem', width: '14rem', fontSize: '.9em' }}>
          <div>Записване:</div>
          <div>до {getLocaleDateTime(scheme.registrationEnd)}</div>
        </div>
      );
  }
}

function getLimitations(scheme) {
  const limitations = [];
  const ages = [];
  if (scheme.schemeType == Enums.SchemeType.ELIMINATION)
    limitations.push('елиминации ' + getSize(scheme));
  if (scheme.schemeType == Enums.SchemeType.GROUP)
    limitations.push('групи ' + getSize(scheme));
  if (scheme.maleTeams)
    limitations.push('мъже');
  if (scheme.femaleTeams)
    limitations.push('жени');
  if (scheme.mixedTeams)
    limitations.push('микс');

  if (scheme.ageFrom || scheme.ageTo)
    limitations
      .push([
        scheme.ageFrom ? scheme.ageFrom : "",
        scheme.ageTo ? scheme.ageTo : "",
      ].join(" - "));

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

function getLocaleDateTime(date) {
  const d = new Date(date);
  return d.toLocaleString();
}