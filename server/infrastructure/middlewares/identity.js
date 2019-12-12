const { Tokens, Users } = require('../../db');

module.exports = async (req, _, next) => {
  const header = req.get('Authorization');
  if (!header)
    return next();

  let tokenValue = header.split('Bearer')[1];
  if (!tokenValue)
    return next();

  tokenValue = tokenValue.trim();
  const token = await Tokens.findOne({
    where: { token: tokenValue },
    include: [{
      model: Users,
      as: 'user',
      attributes: {
        exclude: ['passwordSalt', 'passwordHash']
      },
      include: ['team']
    }]
  });

  if (token && token.expires < new Date())
    return next();
  if (!token)
    return next();

  req.user = token.user;
  return next();
}