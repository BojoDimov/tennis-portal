const crypto = require('crypto');
const { SmtpCredentials } = require('./models');

function createCredentials(userId, username, password) {
  const cipher = crypto.createCipher('aes192', 'ksa051saDIJ31032gka');
  const decipher = crypto.createDecipher('aes192', 'ksa051saDIJ31032gka');
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return SmtpCredentials
    .create({
      userId: userId,
      service: 'gmail',
      username: username,
      passwordHash: encrypted
    })
    .then((credentials) => {
      let decrypted = decipher.update(credentials.passwordHash, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      console.log(decrypted);
      process.exit();
    });
}

module.exports = {
  createCredentials
};
