const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { SmtpCredentials } = require('./models');

function createCredentials(userId, service, username, password) {
  const cipher = crypto.createCipher('aes192', 'ksa051saDIJ31032gka');
  const decipher = crypto.createDecipher('aes192', 'ksa051saDIJ31032gka');
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return SmtpCredentials
    .create({
      userId: userId,
      service: service,
      username: username,
      passwordHash: encrypted
    })
    .then((credentials) => {
      let decrypted = decipher.update(credentials.passwordHash, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
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

function payment_demo() {
  var hmac = require('crypto').createHmac('sha1', "S9TUFF9FKSN2G0QIPV8U9IY800ROJ059OHA63PJCT0BDD9EA98GEJR1YSPMNV9O5");
  let data = `MIN=D252247444
INVOICE=15
AMOUNT=25.00
CURRENCY=BGN
EXP_TIME=01.08.2020
DESCR=Плащане такса турнир
ENCODING=utf-8`;
  let encoded = new Buffer(data).toString('base64');
  let checksum = hmac.update(encoded).digest('hex');
  let decoded = new Buffer(encoded, 'base64').toString();
}

function payment_real() {
  var hmac = require('crypto').createHmac('sha1', "J8Z3TXF2E53Y4QSAK0R26OIMRIJXBDOFMBVTN56HQG6N604RD9Q6COEGISLI70NF");
  let data = `MIN=0553292350
INVOICE=19
AMOUNT=1
CURRENCY=BGN
EXP_TIME=01.08.2050
DESCR=Плащане такса турнир Сингъл - Мъже
ENCODING=utf-8`;
  let encoded = new Buffer(data).toString('base64');
  let checksum = hmac.update(encoded).digest('hex');
  let decoded = new Buffer(encoded, 'base64').toString();
}

payment_real();

module.exports = {
  createCredentials,
  testCredentials
};
