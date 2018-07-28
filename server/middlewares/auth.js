const passport = require('passport');
const HttpBearerStrategy = require('passport-http-bearer').Strategy;
const { Tokens } = require('../db');
const { Users } = require('../models');

passport.use(new HttpBearerStrategy((bearer, next) => {
  return Tokens
    .findOne({
      where: { token: bearer },
      include: [
        { model: Users, as: 'user', attributes: ['id', 'name', 'birthDate', 'gender', 'isAdmin'] }
      ]
    })
    .then(token => {
      if (token && token.expires > new Date())
        next(null, token.user);
      else
        next(null, false);
    })
    .catch(err => next(err));
}));

module.exports = passport.authenticate('bearer', { session: false });