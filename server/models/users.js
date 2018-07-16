const crypto = require('crypto');
const { Users, Tokens } = require('../db');

Users.issueToken = (id, ip) => {
  return Tokens
    .findOne({
      where: { userId: id },
      include: [
        { model: Users, as: 'user', attributes: ['id', 'name', 'birthDate', 'gender'] }
      ]
    })
    .then(token => {
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      if (token)
        return token
          .update({
            token: crypto.randomBytes(40).toString('hex').slice(40),
            expires: expires,
            issued: ip
          });
      else
        return Tokens
          .create({
            userId: id,
            token: crypto.randomBytes(40).toString('hex').slice(40),
            expires: expires,
            issued: ip
          })
          .then(token => Tokens
            .findById(token.id, {
              include: [
                {
                  model: Users, as: 'user', attributes: ['id', 'name', 'birthDate', 'gender']
                }
              ]
            })
          );
    });
}

module.exports = Users;