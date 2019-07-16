const { Tokens } = require('../../db');

module.exports = async (req, _, next) => {
  const header = req.get('Authorization');
  if (!header)
    return next();

  let tokenValue = header.split('Bearer')[1];
  if (!tokenValue)
    return next();

  tokenValue = tokenValue.trim();
  const token = await Tokens.findOne({ where: { token: tokenValue }, include: ['user'] });
  if (!token)
    return next();

  req.user = token.user;
  return next();
}