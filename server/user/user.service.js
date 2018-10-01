const {
  Gender,
  PlayStyle,
  CourtType,
  BackhandType
} = require('../infrastructure/enums');
const { Users, sequelize } = require('../db');


class UserService {
  getAll() {
    return Users
      .findAll({
        attributes: ['id', 'email', 'name', 'isActive', 'isAdmin', 'createdAt']
      });
  }

  create(model) {
    return trim(model)
      .then(validate)
      .then(format)
      .then(Users.create);
  }

  update(model) {
    return trim(model)
      .then(validate)
      .then(format)
      .then(model => Users
        .findById(model.id)
        .then(user => user.update(model))
      );
  }

  trim(model) {
    model.email = model.email.trim();
    model.firstName = model.firstName.trim();
    model.lastName = model.lastName.trim();
    model.telephone = model.telephone.trim();
    model.gender = Gender[model.Gender];
    model.playStyle = PlayStyle[model.playStyle];
    model.backhandType = BackhandType[model.backhandType];
    model.courtType = CourtType[model.courtType];
    model.startedPlaying = parseInt(model.startedPlaying);

    return Promise.resolve(model);
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

    return Promise.resolve(model);
  }

  validate(model) {
    trim(model);

    const promises = [];
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

    //TODO: add checks for
    /*
      email: unique, valid email format
      birthDate: valid range
      telephone: valid telephone format
    */

    return Promise
      .all(promises)
      .then(() => {
        let errCount = Object.keys(errors)
          .reduce((curr, next) => curr + errors[next].length, 0);

        if (errCount > 0)
          throw errors;

        return model;
      });
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
}

module.exports = new UserService();