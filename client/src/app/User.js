import React from 'react';
import { get, imgUrl, post, file } from '../services/fetch';
import { Gender, PlayStyle, CourtType, BackhandType } from '../enums';
import EnumsLocalization from '../enumLocalization';
import * as UserService from '../services/user';

export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedUser: UserService.getUser(),
      user: {
        details: {}
      },
      errors: {},
      canEdit: false,
      isInEditMode: false
    }
  }

  componentDidMount() {
    get(`/users/${this.props.match.params.id}`)
      .then(e => this.setState({
        user: e,
        canEdit: this.state.loggedUser && e.id == this.state.loggedUser.id
      }));

    let input = document.getElementById('profile-image');
    let self = this;

    input.addEventListener('change', e => {
      if (input.files[0])
        file(input.files[0])
          .then(e => {
            let user = self.state.user;
            user.details.profilePictureId = e.id;
            this.setState({ user: user });
          })
          .catch(() => input.value = '');
    });
  }

  cancelEdit() {
    get(`/users/${this.props.match.params.id}`)
      .then(e => this.setState({
        user: e,
        canEdit: this.state.loggedUser && e.id == this.state.loggedUser.id,
        isInEditMode: false
      }));
  }

  saveChanges() {
    post(`/users/${this.props.match.params.id}`, this.state.user)
      .then(e => {
        let user = this.state.user;
        user.details = e;

        this.setState({
          user: user,
          isInEditMode: false,
          errors: {}
        });
      })
      .catch(err => this.setState({ errors: err }));
  }

  updateDetails(prop, value) {
    let user = this.state.user;
    user.details[prop] = value;
    this.setState({ user: user });
  }

  render() {
    let user = this.state.user;

    return (
      <div className="wrapper">
        <div className="container">
          <h2 style={{ textAlign: 'center' }}>Потребител</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', margin: 'auto' }} id="user-details" className="row">
            <div style={{ textAlign: 'center' }}>
              <ImageComponent
                imageId={this.state.user.details.profilePictureId}
                gender={this.state.user.gender} />

              <input id="profile-image" type="file" accept=".jpg, .jpeg, .png" style={{ display: (this.state.isInEditMode ? '' : 'none') }} />
            </div>

            <div>
              <DataBox label="Име" data={user.name} />
              <DataBox label="Пол" data={EnumsLocalization.Gender[user.gender]} />
              <DataBox label="Рожденна дата" data={this.getDate(user.birthDate)} />

              {this.state.isInEditMode ?
                <form style={{ textAlign: 'left' }}>
                  <div className="row gtr-50">
                    <div className="col-12">
                      <div>Започнах да играя тенис през:</div>
                      <input placeholder="няма записани данни"
                        value={user.details.startedPlaying}
                        type="number"
                        onChange={e => this.updateDetails('startedPlaying', e.target.value || null)} />
                      <div className="error">{this.state.errors.startedPlaying ? '*Въведете нормална дата' : null}</div>
                    </div>

                    <div className="col-12">
                      <div>Играя със:</div>
                      <select value={user.details.playStyle} onChange={e => this.updateDetails('playStyle', e.target.value)}>
                        <option value={null} selected >няма записани данни</option>
                        <option value={PlayStyle.LEFT}>{EnumsLocalization.PlayStyle[PlayStyle.LEFT]}</option>
                        <option value={PlayStyle.RIGHT}>{EnumsLocalization.PlayStyle[PlayStyle.RIGHT]}</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <div>Бекхенд: </div>
                      <select value={user.details.backhand} onChange={e => this.updateDetails('backhand', e.target.value)}>
                        <option value={null} selected >няма записани данни</option>
                        <option value={BackhandType.ONE}>{EnumsLocalization.BackhandType[BackhandType.ONE]}</option>
                        <option value={BackhandType.TWO}>{EnumsLocalization.BackhandType[BackhandType.TWO]}</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <div>Любима настилка: </div>
                      <select value={user.details.courtType} onChange={e => this.updateDetails('courtType', e.target.value)}>
                        <option value={null} selected >няма записани данни</option>
                        <option value={CourtType.CLAY}>{EnumsLocalization.CourtType[CourtType.CLAY]}</option>
                        <option value={CourtType.HARD}>{EnumsLocalization.CourtType[CourtType.HARD]}</option>
                        <option value={CourtType.GRASS}>{EnumsLocalization.CourtType[CourtType.GRASS]}</option>
                        <option value={CourtType.INDOOR}>{EnumsLocalization.CourtType[CourtType.INDOOR]}</option>
                      </select>
                    </div>
                  </div>
                </form>
                : <React.Fragment>
                  <DataBox label="Започнах да играя през" data={user.details.startedPlaying} />
                  <DataBox label="Играя със" data={EnumsLocalization.PlayStyle[user.details.playStyle]} />
                  <DataBox label="Бекхенд" data={EnumsLocalization.BackhandType[user.details.backhand]} />
                  <DataBox label="Любима настилка" data={EnumsLocalization.CourtType[user.details.courtType]} />
                </React.Fragment>}

              <div style={{ marginTop: '1rem' }}>
                {this.state.isInEditMode ?
                  <React.Fragment>
                    <span onClick={() => this.saveChanges()}>
                      <i class="fas fa-save fa-2x"
                        style={{ cursor: 'pointer', color: '#84DC00' }}></i>
                    </span>
                    <span onClick={() => this.cancelEdit()}>
                      <i class="fas fa-ban fa-2x"
                        style={{ cursor: 'pointer', marginLeft: '.3em', color: '#f97c91' }}></i>
                    </span>
                  </React.Fragment> :
                  <div>
                    {this.state.canEdit ?
                      <span onClick={() => this.setState({ isInEditMode: true })}><i className="fas fa-pencil-alt fa-2x" style={{ cursor: 'pointer' }}></i></span>
                      : null}
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getDate(dateString) {
    if (dateString == null)
      return null;

    let date = new Date(dateString);
    return date.toLocaleDateString();
  }
}

export class DataBox extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'space-between' }}>
        <div className="trapezoid-r">
          <span>{this.props.label}</span>
        </div>
        <div className="trapezoid-l">
          {this.props.data ? <span>{this.props.data}</span> : <span>няма данни</span>}
        </div>
      </div>
    )
  }
}

export class ImageComponent extends React.Component {
  render() {
    if (this.props.imageId != null)
      return <div><img src={imgUrl(this.props.imageId)} /></div>;
    else if (this.props.gender == Gender.FEMALE)
      return <div><img src="../images/woman.png" /></div>;
    else
      return <div><img src="../images/man.png" /></div>;
  }
}
