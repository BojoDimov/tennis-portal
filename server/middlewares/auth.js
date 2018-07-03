const passport = require('passport');
const HttpBearerStrategy = require('passport-http-bearer').Strategy;
const { Tokens } = require('../db');

passport.use(new HttpBearerStrategy((bearer, next) => {
  return Tokens
    .findOne({
      where: { token: bearer }
    })
    .then(token => {
      if (token && token.expires > new Date())
        next(null, true);
      else
        next(null, false);
    })
    .catch(err => next(err));
}));

module.exports = passport.authenticate('bearer', { session: false });