const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

function testCredentials(service, username, password) {
  const transporter = nodemailer.createTransport({
    host: service,
    port: '465',
    secure: true,
    auth: {
      user: username,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const options = {
    from: username,
    to: 'bojko958@abv.bg',
    subject: 'test email sender',
    text: 'test'
  }
  return transporter.sendMail(options);
}

module.exports = {
  createCredentials,
  testCredentials
};
