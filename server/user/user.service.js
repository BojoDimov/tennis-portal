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
  Teams,
  UserActivationCodes,
  sequelize,
  Sequelize
} = require('../db');


class UserService {
  getAll() {
    return Users
      .findAll({
        attributes: {
          exclude: ['passwordHash', 'passwordSalt']
        },
        order: [['name', 'asc']]
      });
  }

  async getByEmail(email) {
    return await Users.findOne({ where: { email } });
  }

  async create(model) {
    model = this.trim(model);
    model = await this.validate(model, false);
    model = this.format(model);
    return Users.create(model);
  }

  async update(id, model) {
    model = this.trim(model);
    await this.validate(model, true);
    const user = await Users.findById(id);
    if (!user)
      throw { name: 'NotFound' };
    return await user.update({
      name: model.firstName.charAt(0).toUpperCase() + model.firstName.substr(1)
        + ' ' +
        model.lastName.charAt(0).toUpperCase() + model.lastName.substr(1),
      birthDate: model.birthDate,
      telephone: model.telephone,
      gender: model.gender,
      startedPlaying: model.startedPlaying,
      backhandType: model.backhandType,
      courtType: model.courtType,
      playStyle: model.playStyle
    });
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
    model.birthDate = model.birthDate ? new Date(model.birthDate) : null;
    model.gender = model.gender || null;
    model.playStyle = model.playStyle || null;
    model.courtType = model.courtType || null;
    model.backhandType = model.backhandType || null;
    return model;
  }

  format(model) {
    model.name = model.firstName.charAt(0).toUpperCase() + model.firstName.substr(1)
      + ' ' +
      model.lastName.charAt(0).toUpperCase() + model.lastName.substr(1);

    this.encryptPassword(model, model.password);
    return model;
  }

  encryptPassword(model, password) {
    let hash = crypto.createHash('sha256');
    model.passwordSalt = crypto.randomBytes(16).toString('hex').slice(16);
    hash.update(model.passwordSalt + password);
    model.passwordHash = hash.digest('hex').slice(40);
  }

  async validate(model, isEditMode = false) {
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
    if (!model.firstName) errors.firstName.push('required');
    if (!model.lastName) errors.lastName.push('required');
    if (!model.telephone) errors.telephone.push('required');
    //if (!model.birthDate) errors.birthDate.push('required');
    //if (!model.gender) errors.gender.push('required');

    if (!isEditMode) {
      const existingEmail = await Users.findOne({ where: { email: model.email } });

      if (!model.email) errors.email.push('required');
      if (!model.password) errors.password.push('required');
      if (!model.confirmPassword) errors.confirmPassword.push('required');
      if (existingEmail)
        errors.email.push('unique');
      if (model.password && model.password.length < 6)
        errors.password.push('short');
      if (model.password && model.password.match(/[А-я]+/))
        errors.password.push('invalid');
      if (model.password && model.confirmPassword && model.confirmPassword !== model.password)
        errors.confirmPassword.push('mismatch');
    }

    //invalid values
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
    //REFACTOR THIS USING DESTROY + INCLUDE
    return sequelize.transaction((trn) => {
      return Promise
        .all([
          Users.destroy({ where: { id: id }, transaction: trn }),
          Teams.destroy({ where: { user1Id: id, user2Id: null }, transaction: trn }),
          Tokens.destroy({ where: { userId: id }, transaction: trn }),
          UserActivationCodes.destroy({ where: { userId: id }, transaction: trn })
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

  async activateUser(token) {
    return await sequelize.transaction(async trn => {
      const uac = await UserActivationCodes.findOne({
        where: {
          token: token,
          expires: {
            [Sequelize.Op.gte]: new Date()
          }
        },
        include: ['user']
      });

      if (!uac)
        throw { name: 'DomainActionError' };

      await UserActivationCodes.destroy({ where: { id: uac.id }, transaction: trn });
      return await uac.user.update({ isActive: true }, { transaction: trn });
    });
  }

  async recoverPassword(model) {
    return await sequelize.transaction(async trn => {
      const uac = await UserActivationCodes.findOne({
        where: {
          token: model.token,
          expires: {
            [Sequelize.Op.gte]: new Date()
          }
        },
        include: ['user']
      });

      model.password = model.password.trim();
      model.confirmPassword = model.confirmPassword.trim();
      if (!model.password || !model.confirmPassword || model.password != model.confirmPassword)
        throw { name: 'DomainActionError', error: { message: 'Моля проверете изписването на паролите.' } };

      if (model.password.length < 6)
        throw { name: 'DomainActionError', error: { message: 'Новата ви парола трябва да бъде от поне 6 символа.' } };

      if (!uac)
        throw { name: 'DomainActionError', error: { message: 'Кодът за възстановяване е с изтекъл срок или е невалиден.' } };

      await UserActivationCodes.destroy({ where: { id: uac.id }, transaction: trn });
      this.encryptPassword(uac.user, model.password);
      await uac.user.save({ transaction: trn });
    });
  }
}

module.exports = new UserService();