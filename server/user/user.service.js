const crypto = require('crypto');
const {
  Gender,
  PlayStyle,
  CourtType,
  BackhandType
} = require('../infrastructure/enums');

const {
  Users,
  Tokens,
  sequelize
} = require('../db');


class UserService {
  getAll() {
    return Users
      .findAll({
        attributes: ['id', 'email', 'name', 'isActive', 'isAdmin', 'createdAt']
      });
  }

  async create(model) {
    model = this.trim(model);
    model = await this.validate(model);
    model = this.format(model);
    return Users.create(model);
  }

  async update(model) {
    model = this.trim(model);
    await this.validate(model);
    model = this.format(model);
    const user = await Users.findById(model.id);
    if (!user)
      throw { name: 'NotFound' };
    return user.update(model);
  }

  //null if value is undefined, -1 if there is error, true if ok
  validateEnum(Enum, value) {
    if (!value)
      return null;
    else
      return Object.keys(Enum).some(key => Enum[key] == value);
  }

  trim(model) {
    model.email = model.email.trim();
    model.firstName = model.firstName.trim();
    model.lastName = model.lastName.trim();
    model.telephone = model.telephone.trim();
    model.startedPlaying = model.startedPlaying ? parseInt(model.startedPlaying) : null;
    model.birthDate = new Date(model.birthDate);
    model.playStyle = model.playStyle || null;
    model.courtType = model.courtType || null;
    model.backhandType = model.backhandType || null;
    return model;
  }

  format(model) {
    model.name = model.firstName.charAt(0).toUpperCase() + model.firstName.substr(1)
      + ' ' +
      model.lastName.charAt(0).toUpperCase() + model.lastName.substr(1);

    const crypto = require('crypto');
    let hash = crypto.createHash('sha256');
    model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
    hash.update(model.passwordSalt + model.password);
    model.passwordHash = hash.digest('hex').slice(40);
    //TODO: remove this after email service is implemented
    model.isActive = true;
    return model;
  }

  async validate(model) {
    const errors = {
      email: [],
      password: [],
      confirmPassword: [],
      firstName: [],
      lastName: [],
      telephone: [],
      birthDate: [],
      gender: [],
      startedPlaying: [],
      playStyle: [],
      backhandType: [],
      courtType: []
    };

    //required fields
    if (!model.email) errors.email.push('required');
    if (!model.password) errors.password.push('required');
    if (!model.confirmPassword) errors.confirmPassword.push('required');
    if (!model.firstName) errors.firstName.push('required');
    if (!model.lastName) errors.lastName.push('required');
    if (!model.telephone) errors.telephone.push('required');
    if (!model.birthDate) errors.birthDate.push('required');
    if (!model.gender) errors.gender.push('required');

    //invalid values
    if (model.password && model.password.length < 6)
      errors.password.push('short');
    if (model.password.match(/[А-я]+/))
      errors.password.push('invalid');
    if (model.password && model.confirmPassword && model.confirmPassword !== model.password)
      errors.confirmPassword.push('mismatch');

    if (isNaN(model.startedPlaying))
      errors.startedPlaying.push('invalid');
    if (!isNaN(model.startedPlaying)
      && model.startedPlaying != null
      && model.birthDate
      && new Date(model.startedPlaying) <= model.birthDate.getFullYear())
      errors.startedPlaying.push('range');
    if (!isNaN(model.startedPlaying)
      && model.startedPlaying != null
      && model.startedPlaying > new Date().getFullYear())
      errors.startedPlaying.push('future');

    if (model.email && !model.email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/))
      errors.email.push('invalid');

    const existingEmail = await Users.findOne({ where: { email: model.email } });
    if (existingEmail)
      errors.email.push('unique');

    if (model.birthDate && model.birthDate > new Date() || model.birthDate < new Date(1900, 1, 1))
      errors.birthDate.push('invalid');

    const telRegex = model.telephone.match(/^[0-9,+,(,)]+$/);
    if (model.telephone && !telRegex)
      errors.telephone.push('invalid');

    if (this.validateEnum(Gender, model.gender) === false)
      errors.gender.push('invalid');

    if (this.validateEnum(PlayStyle, model.playStyle) === false)
      errors.playStyle.push('invalid');

    if (this.validateEnum(BackhandType, model.backhandType) === false)
      errors.backhandType.push('invalid');

    if (this.validateEnum(CourtType, model.courtType) === false)
      errors.courtType.push('invalid');

    let errCount = Object.keys(errors).reduce((curr, next) => curr + errors[next].length, 0);

    if (errCount > 0)
      throw { name: 'DomainActionError', error: errors };
    return model;
  }

  delete(id) {
    return sequelize.transaction((trn) => {
      return Promise
        .all([
          Users.destroy({ where: { id: id }, transaction: trn }),
          Teams.destroy({ where: { user1Id: id, user2Id: null }, transaction: trn })
        ]);
    });
  }

  async issueToken(id, ip) {
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    let token = await Tokens.findOne({ where: { userId: id } });

    if (token)
      token = await token.update({ expires });
    else
      token = await Tokens.create({
        userId: id,
        issued: ip,
        expires: expires,
        token: crypto.randomBytes(40).toString('hex').slice(40)
      });

    return await Tokens.findById(token.id, {
      include: [
        { model: Users, as: 'user', attributes: ['id', 'name', 'email', 'gender', 'birthDate', 'isAdmin'] }
      ]
    });
  }
}

module.exports = new UserService();