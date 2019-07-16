const { Tokens, Users } = require('../../db');

module.exports = async (req, res, next) => {
  const header = req.get('Authorization');

  if (!header)
    return res.status(401).send();

  let tokenValue = header.split('Bearer')[1];
  if (!tokenValue)
    return res.status(401).send();

  tokenValue = tokenValue.trim();
  const token = await Tokens.findOne({
    where: { token: tokenValue },
    include: [
      {
        model: Users,
        as: 'user',
        where: {
          isAdmin: true
        }
      }
    ]
  });
  if (!token)
    return res.status(401).send();

  req.user = token.user;
  return next();
}

