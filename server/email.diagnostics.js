require('dotenv').config();
const nodemailer = require('nodemailer');
const { Users, SmtpCredentials } = require('./models');
const crypto = require('crypto');

async function main() {
  let systemUser = await Users
    .findOne({
      where: {
        isSystemAdministrator: true
      },
      include: [{ model: SmtpCredentials, as: 'smtp' }]
    });
  console.log('SystemUser: ', systemUser);

  let decipher = crypto.createDecipher('aes192', 'ksa051saDIJ31032gka');
  let password = decipher.update(systemUser.smtp.passwordHash, 'hex', 'utf8');
  password += decipher.final('utf8');

  console.log('SmtpUsername', systemUser.smtp.username);
  console.log('SmtpPassword', password);

  const email = {
    from: systemUser.smtp.username,
    to: 'bojko958@abv.bg',
    subject: 'smilevent email diagnostics',
    html: 'smilevent email diagnostics'
  };

  console.log('Email:', email);

  const transporter = nodemailer.createTransport({
    host: systemUser.smtp.service,
    port: '465',
    secure: true,
    auth: {
      user: systemUser.smtp.username,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter
    .sendMail(email)
    .then(result => {
      console.log('Email result:', result);
      return true;
    });
}

main()
  .then(_ => console.log('email diagnostics finished successfully'))
  .catch(ex => console.log('email diagnostics threw an exception', ex));