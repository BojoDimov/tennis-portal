const passport = require('passport');
const HttpBearerStrategy = require('passport-http-bearer').Strategy;
const { Tokens, Users } = require('../../db');

passport.use(new HttpBearerStrategy(async (bearer, next) => {
  try {
    const token = await Tokens
      .findOne({
        where: { token: bearer },
        include: [
          { model: Users, as: 'user', attributes: ['id', 'name', 'email', 'birthDate', 'gender', 'isAdmin'] }
        ]
      });
    if (token && token.expires > new Date())
      next(null, token.user);
    else
      next(null, false);
  }
  catch (err) {
    return next(err);
  }
}));

module.exports = passport.authenticate('bearer', { session: false });