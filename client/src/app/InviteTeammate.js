import React from 'react';
import { Link } from 'react-router-dom';
import { post, get } from '../services/fetch';
import { ConfirmationButton, createOpenModalEvent, AccommodationMessage } from './Infrastructure';
import * as UserService from '../services/user';


export default class InviteTeammate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      scheme: {
        TournamentEdition: {}
      }
    }
  }

  getData() {
    post(`/invitations/available`, {
      schemeId: this.props.match.params.id,
      searchTerm: this.state.searchTerm
    })
      .then(e => this.setState({ users: e }))
      .catch(err => this.setState({ error: err.message }));

    get(`/schemes/${this.props.match.params.id}`)
      .then(scheme => this.setState({ scheme: scheme }));
  }

  componentDidMount() {
    this.getData();
  }

  search(e) {
    if (e)
      e.preventDefault();
    this.getData();
  }

  accept(user) {
    get(`/invitations/accept?userId=${user.id}&schemeId=${this.props.match.params.id}`)
      .then(() => {
        this.props.history.push(`/schemes/${this.props.match.params.id}`);
        setTimeout(() => {
          createOpenModalEvent(<AccommodationMessage />, () => null);
        }, 2000);
      });
  }

  revoke(user) {
    get(`/invitations/revoke?userId=${user.id}&schemeId=${this.props.match.params.id}`)
      .then(() => {
        user.canRevoke = false;
        user.canInvite = true;
        this.setState({ users: this.state.users });
      })
  }

  invite(user) {
    get(`/invitations/invite?userId=${user.id}&schemeId=${this.props.match.params.id}`)
      .then(() => {
        user.canRevoke = true;
        user.canInvite = false;
        this.setState({ users: this.state.users });
      })
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container list list-condensed">
          <h2>{this.state.scheme.TournamentEdition.name} - {this.state.scheme.name} - Избор на партньор</h2>
          <form onSubmit={(e) => this.search(e)}>
            <div className="row gtr-50">
              <div className="col-12">
                <input placeholder="Търсене" type="text" style={{ display: 'inline', paddingRight: '40px' }}
                  onChange={e => this.setState({ searchTerm: e.target.value })} />
                <span style={{ marginLeft: '-40px', cursor: 'pointer' }} onClick={(е) => this.search(е)}>
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </form>
          {this.state.error ?
            <h4>{this.state.error}</h4> : null}
          {!this.state.error && this.state.users.length == 0 ?
            <h4>Няма намерени резултати</h4> : null}
          {this.state.users.map(this.getUser.bind(this))}
        </div>
      </div>
    )
  }

  getUser(user, i) {
    let button = this.getButton(user);

    return (
      <div className="list-row" key={i} style={{ textAlign: 'left' }}>
        {/* list-row-header */}
        <div style={{ flexGrow: 1, flexBasis: '20rem' }}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </div>

        <div style={{ width: '12rem' }}>
          {button ?
            <ConfirmationButton message={button.message}
              confirm={button.confirm}
              onChange={flag => flag ? button.onClick() : null} >
              <span className={`special-button small ${button.class}`}
                title={button.title}>{button.name}</span>
            </ConfirmationButton>
            : null}
        </div>
      </div>
    );
  }

  getButton(user) {
    if (user.canAccept)
      return {
        confirm: true,
        message: `Моля, потвърдете, че искате да сте в отбор с ${user.name}`,
        title: `Ще бъдете записани в отбор с ${user.name}`,
        name: 'Приемане',
        class: 'g',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.accept(user)
        }
      }

    if (user.canInvite)
      return {
        confirm: true,
        message: `Моля, потвърдете изпращането на покана до ${user.name}. Ще бъдете уведомени с имейл когато ${user.name} приеме поканата Ви.`,
        title: `Ще бъдете уведомени когато ${user.name} приеме поканата`,
        name: 'Покана',
        class: 'g',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.invite(user)
        }
      }

    if (user.canRevoke)
      return {
        confirm: true,
        message: `Моля, потвърдете отказа на поканата към ${user.name}`,
        title: null,
        name: 'Отказ на поканата',
        class: 'b',
        onClick: (e) => {
          if (e)
            e.stopPropagation();
          return this.revoke(user)
        }
      }
  }
}