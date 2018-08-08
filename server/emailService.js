const nodemailer = require('nodemailer');
const { EmailType } = require('./enums');

const TEMPLATES = {
  [EmailType.REGISTER]: function (scope) {
    return {
      subject: `Записване за турнир`,
      body: `<p>Здравейте, бяхте записан за турнир ${scope.tournamentName} - ${scope.editionName} - ${scope.schemeName}.</p>
      <p>Това съобщение е автоматично генерирано, моля не изпращайте отговор</p>
      <p>За контакти и въпроси: Ивайло Коев
      тел: +359 883 326 235
      e-mail: tournaments@smilevent.net</p>`
    };
  },
  [EmailType.UNREGISTER]: function (scope) {
    return {
      subject: `Отписване от турнир`,
      body: `<p>Здравейте, бяхте отписан от турнир ${scope.tournamentName} - ${scope.editionName} - ${scope.schemeName}.</p>
      <p>Това съобщение е автоматично генерирано, моля не изпращайте отговор</p>
      <p>За контакти и въпроси: Ивайло Коев
      тел: +359 883 326 235
      e-mail: tournaments@smilevent.net</p>`
    };
  }
}

function sendEmail(emailType, credentials, model, emails) {
  const template = TEMPLATES[emailType](model);
  let decipher = require('crypto').createDecipher('aes192', 'ksa051saDIJ31032gka');
  let password = decipher.update(credentials.passwordHash, 'hex', 'utf8');
  password += decipher.final('utf8');

  const transporter = nodemailer.createTransport({
    service: credentials.service,
    auth: {
      user: credentials.username,
      pass: password
    }
  });

  const options = {
    from: credentials.username,
    to: emails.join(', '),
    subject: template.subject,
    html: template.body
  }

  return transporter.sendMail(options);
}

module.exports = {
  sendEmail
}