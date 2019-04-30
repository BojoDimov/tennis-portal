import React from 'react';
import { Link } from 'react-router-dom';
import { get } from '../services/fetch';
import { createOpenModalEvent, ConfirmationButton, AccommodationMessage } from './Infrastructure';

export default class Invitations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitations: []
    }
  }

  getData() {
    get(`/invitations`)
      .then(e => this.setState({ invitations: e }));
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div class="wrapper">
        <section class="container">
          <section>
            <header class="major">
              <h2>Покани</h2>
            </header>
            <InvitationsWrapper
              invitations={this.state.invitations}
              history={this.props.history}
              onChange={() => this.getData()} />
          </section>
        </section>
      </div>
    );
  }
}

class InvitationsWrapper extends React.Component {
  render() {
    if (this.props.invitations.length > 0)
      return (
        <React.Fragment>
          {this.props.invitations.map((e, i) => (
            <Invitation
              data={e}
              key={i}
              history={this.props.history}
              onChange={(e) => this.props.onChange(e)} />
          ))}
        </React.Fragment>
      );
    else return (
      <i>нямате текущи покани</i>
    );
  }
}

class Invitation extends React.Component {
  render() {
    let data = this.props.data;
    return (
      <div
        className="button basic"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <table style={{ tableLayout: 'fixed', flexBasis: '20rem', textAlign: 'left' }}>
          <tbody>
            <tr>
              <td>Издание: </td>
              <td><Link to={`/editions/${data.scheme.TournamentEdition.id}`}>{data.scheme.TournamentEdition.name}</Link></td>
            </tr>
            <tr>
              <td>Турнир:</td>
              <td><Link to={`/schemes/${data.scheme.id}`}>{data.scheme.name}</Link></td>
            </tr>
            <tr>
              <td>Партньор:</td>
              <td><Link to={`/users/${data.inviter.id}`}>{data.inviter.name}</Link></td>
            </tr>
          </tbody>
        </table>
        {/* <div style={{ fontSize: '1.2em', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>Издание: <Link to={`/editions/${data.scheme.TournamentEdition.id}`}>{data.scheme.TournamentEdition.name}</Link></div>
          <div>Турнир: <Link to={`/schemes/${data.scheme.id}`}>{data.scheme.name}</Link></div>
          <div>Изпращач: <Link to={`/users/${data.inviter.id}`}>{data.inviter.name}</Link></div>
        </div> */}
        <ConfirmationButton
          message={`Моля, потвърдете, че искате да сте в отбор с ${data.inviter.name}`}
          confirm={true}
          onChange={flag => flag ? this.accept() : null} >
          <span
            className="special-button small b"
            style={{ width: '8rem' }}
            title="приемане на покана">Приеми</span>
        </ConfirmationButton>
      </div>
    );
  }

  accept() {
    let data = this.props.data;
    get(`/invitations/accept?userId=${data.inviter.id}&schemeId=${data.scheme.id}`)
      .then(() => {
        this.props.history.push(`/schemes/${data.scheme.id}`);
        setTimeout(() => {
          createOpenModalEvent(<AccommodationMessage />, () => null);
        }, 2000);
      });
  }
}