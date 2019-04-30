import React from 'react';
import { Link } from 'react-router-dom';
import Queries from '../services/queries';
import { BracketPreview } from './bracket/BracketPreview';
import {
  ConfirmationButton,
  createOpenModalEvent,
  AccommodationMessage,
  CancelEnrollMessage,
  TeamNames
} from './Infrastructure';
import { get, post } from '../services/fetch';
import * as Enums from '../enums';
import * as UserService from '../services/user';
import './scheme-view-styles.css';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../clientConfig.js')[env];

export class PaymentForm extends React.Component {
  render() {
    let payment = this.props.payment;
    if (!payment || this.props.disable)
      return null;
    else if (payment.status == Enums.PaymentStatus.PENDING)
      return (
        <span className="payment">
          <i className="fas fa-hourglass-end"
            style={{ marginRight: '.3rem' }}></i>
          Плащането е в процес на обработка.
          </span>
      );
    else if (payment.status == Enums.PaymentStatus.PAID)
      return (
        <span className="payment success">
          <i className="fas fa-check-circle"
            style={{ marginRight: '.3rem' }}></i>
          Платена такса.
        </span>
      );
    else return (
      {/* <form method="POST" action="https://demo.epay.bg/" style={{ marginRight: '1rem' }}>
         <input type="submit" value="Плащане" />
        <input type="hidden" name="PAGE" value="credit_paydirect" />
        <input type="hidden" name="ENCODED" value={this.props.payment.encoded} />
        <input type="hidden" name="URL_OK" value={this.props.url} />
        <input type="hidden" name="URL_CANCEL" value={this.props.url} />
        <input type="hidden" name="CHECKSUM" value={this.props.payment.checksum} /> 
        <input type="submit" value="Плащане" />
        <input type="hidden" name="PAGE" value="paylogin" />
        <input type="hidden" name="MIN" value={payment.min} />
        <input type="hidden" name="INVOICE" value={payment.invoice} />
        <input type="hidden" name="AMOUNT" value={payment.amount} />
        <input type="hidden" name="DESCR" value={payment.description} />
        <input type="hidden" name="ENCODING" value="utf-8" />
        <input type="hidden" name="ENCODED" value={payment.encoded} />
        <input type="hidden" name="URL_OK" value={this.props.url} />
        <input type="hidden" name="URL_CANCEL" value={this.props.url} />
        <input type="hidden" name="CHECKSUM" value={payment.checksum} />
      </form>*/}
    );
  }
}

export default class SchemeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserService.getUser(),
      enrollments: [],
      queue: [],
      draw: {},
      scheme: {
        TournamentEdition: {}
      },
      team: {},
      showEnrollments: true,
      showQueue: false,
      showDraw: true,
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    Queries.Schemes
      .getById(this.props.match.params['id'])
      .then(res => this.setState(res));
  }

  enroll(scheme) {
    get(`/schemes/${scheme.id}/enroll?userId=${this.state.user.id}`)
      .then(() => {
        this.getData();
        createOpenModalEvent(<AccommodationMessage />, () => null);
      });
  }

  cancelEnroll(scheme) {
    get(`/schemes/${scheme.id}/cancelEnroll?userId=${this.state.user.id}`)
      .then(() => this.getData());
  }

  isEnrolled() {
    if (this.state.user)
      return this.state.user && (this.state.enrollments
        .find(e => e.user1Id == this.state.user.id || e.user2Id == this.state.user.id)
        || this.state.queue
          .find(e => e.user1Id == this.state.user.id || e.user2Id == this.state.user.id));
  }

  render() {
    const button = this.getButton(this.state.scheme);

    return (
      <div className="wrapper">
        <div className="container">
          {button ?
            <React.Fragment>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 4, flexBasis: '14rem' }}>
                  <h2>{this.state.scheme.TournamentEdition.name} - {this.state.scheme.name}</h2>
                  <p style={{ fontSize: '.9em' }}>{this.state.scheme.info}</p>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                {/* {this.isEnrolled() ?
                  <PaymentForm payment={this.state.payment}
                    url={`${config.frontend}/schemes/${this.state.scheme.id}`}
                    disable={true} /> : null} */}
                <ConfirmationButton message={button.message}
                  confirm={button.confirm}
                  onChange={flag => flag ? button.onClick() : null} >
                  <span className={`special-button small ${button.class}`}
                    title={button.title}>{button.name}</span>
                </ConfirmationButton>
              </div>
            </React.Fragment>
            : <h2 style={{ textAlign: 'center' }}>{this.state.scheme.TournamentEdition.name} - {this.state.scheme.name}</h2>
          }

          <div className="scheme-list">
            <div className="scheme-list-header" onClick={() => this.setState({ showEnrollments: !this.state.showEnrollments })}>
              Записани
            </div>
            {/* {this.getList(this.state.enrollments, 3)} */}
            {this.state.showEnrollments ?
              this.state.enrollments.map((e, i) =>
                <TeamNames key={i} order={i + 1} team={e} singleTeams={this.state.scheme.singleTeams} />
              )
              : null}

            {this.state.showEnrollments && this.state.enrollments.length == 0 ?
              <div>Няма записани играчи</div> : null}
          </div>

          <div className="scheme-list">
            <div className="scheme-list-header" onClick={() => this.setState({ showQueue: !this.state.showQueue })}>
              Резерви
            </div>
            {/* {this.getList(this.state.enrollments, 3)} */}
            {this.state.showQueue ?
              this.state.queue.map((e, i) =>
                <TeamNames key={i} order={i + 1} team={e} singleTeams={this.state.scheme.singleTeams} />)
              : null}

            {this.state.showQueue && this.state.queue.length == 0 ?
              <div>Няма резерви</div> : null}
          </div>

          <div className="scheme-list" style={{ overflowX: 'auto' }}>
            <div className="scheme-list-header" onClick={() => this.setState({ showDraw: !this.state.showDraw })}>
              Схема
              {this.state.showDraw && this.state.draw.isDrawn ?
                <div style={{ fontSize: '.5em', marginTop: '1rem' }}>
                  <Link to={`/bracket/${this.state.scheme.id}`}>преглед </Link>
                  {this.state.scheme.groupPhase ? <Link to={`/bracket/${this.state.scheme.groupPhaseId}`}>| групова фаза</Link> : null}
                </div> : null}
            </div>
            {/* {this.getList(this.state.enrollments, 3)} */}
            {this.state.showDraw ?
              <BracketPreview draw={this.state.draw} />
              : null}

            {this.state.showDraw && !this.state.draw.isDrawn ?
              <div>Няма изтеглена схема</div> : null}
          </div>
        </div>
      </div>
    );
  }

  getButton(scheme) {
    if (!this.state.user)
      return {
        confirm: false,
        message: null,
        title: null,
        name: 'Записване',
        class: 'b',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.props.history.push(`/login`);
        }
      }

    const age = new Date(new Date() - new Date(this.state.user.birthDate)).getUTCFullYear() - 1970;

    if (scheme.status == Enums.Status.FINALIZED || scheme.hasGroupPhase)
      return null;

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

    if (this.isEnrolled())
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
          confirm: true,
          message: `Сигурни ли сте че искате да се запишете за турнир "${scheme.name}"?`,
          title: 'регистрацията е приключила, ще бъдете записан в опашка',
          name: 'Записване',
          class: 'b',
          onClick: (e) => {
            if (e)
              e.stopPropagation();
            return this.enroll(scheme)
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
        title: 'не отговаряте на изискванията за тази схема',
        name: 'Записване',
        class: 'disabled',
        onClick: (e) => {
          if (e)
            e.stopPropagation()
        }
      }
  }

  getList(collection, itemsOnRow) {
    const items = [];
    for (let i = 0; i < collection.length; i += itemsOnRow) {
      items.push(
        <div className="scheme-list-row" key={i / itemsOnRow}>
          {collection.slice(i, i + itemsOnRow).map((e, j) => <div>{i + j + 1}. {e.user1Name}</div>)}
        </div>
      );
    }

    return items;
  }
}