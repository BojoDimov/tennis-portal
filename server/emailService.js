const nodemailer = require('nodemailer');
const { Users, SmtpCredentials } = require('./models');
const { EmailType } = require('./enums');

const TEMPLATES = {
  [EmailType.REGISTER]: function (scope) {
    return {
      subject: `Записване за турнир`,
      body: `
      <pre>
        Здравейте, бяхте записан/а за турнир ${scope.tournamentName} - ${scope.editionName} - ${scope.schemeName}.
      </pre>
      <pre>
        Това съобщение е автоматично генерирано, моля не изпращайте отговор.
        За контакти и въпроси: Ивайло Коев
        тел: +359 883 326 235
        e-mail: tournaments@smilevent.net
      </pre>
      `
    };
  },
  [EmailType.UNREGISTER]: function (scope) {
    return {
      subject: `Отписване от турнир`,
      body: `
      <pre>
        Здравейте, бяхте отписан/а от турнир ${scope.tournamentName} - ${scope.editionName} - ${scope.schemeName}.
      </pre>
      <pre>
        Това съобщение е автоматично генерирано, моля не изпращайте отговор.
        За контакти и въпроси: Ивайло Коев
        тел: +359 883 326 235
        e-mail: tournaments@smilevent.net
      </pre>
      `
    };
  },
  [EmailType.REGISTER + EmailType.NOTIFICATION]: function (scope) {
    return {
      subject: `Записани за турнир`,
      body: `
      <pre>
        Потребителите: ${scope.users.join(', ')} бяха записани за турнир ${scope.tournamentName} - ${scope.editionName} - ${scope.schemeName}.
      </pre>
      `
    };
  },
  [EmailType.UNREGISTER + EmailType.NOTIFICATION]: function (scope) {
    return {
      subject: `Отписани от турнир`,
      body: `
      <pre>
        Потребителите: ${scope.users.join(', ')} бяха отписани от турнир ${scope.tournamentName} - ${scope.editionName} - ${scope.schemeName}.
      </pre>
      `
    };
  },
  [EmailType.RECOVERY]: function (scope) {
    return {
      subject: `Възстановяване на забравена парола в сайта на Smile Cup`,
      body: `
      <pre>
        Здравейте, използвайте <a href="${scope.recovery}">този</a> линк
        за да изберете нова парола за своя акаунт в SmileCup.
      </pre>
      <pre>
        Това съобщение е автоматично генерирано, моля не изпращайте отговор.
        За контакти и въпроси: Ивайло Коев
        тел: +359 883 326 235
        e-mail: tournaments@smilevent.net
      </pre>
      `
    }
  },
  [EmailType.ACTIVATION]: function (scope) {
    return {
      subject: `Активиране на акаунт в сайта на Smile Cup`,
      body: `
      <pre>
        Здравейте, използвайте <a href="${scope.activation}">този</a> линк
        за да активирате своя акаунт в SmileCup.
      </pre>
      <pre>
        Това съобщение е автоматично генерирано, моля не изпращайте отговор.
        За контакти и въпроси: Ивайло Коев
        тел: +359 883 326 235
        e-mail: tournaments@smilevent.net
      </pre>
      `
    }
  },
  [EmailType.PAYMENT_ACCEPTED]: function (scope) {
    return {
      subject: `Успешно извършено плащане към SmileCup`,
      body: `
      <pre>
        Успешно извършихте плащане на такса участие за турнир ${scope.name}.
      </pre>
      <pre>
        Това съобщение е автоматично генерирано, моля не изпращайте отговор.
        За контакти и въпроси: Ивайло Коев
        тел: +359 883 326 235
        e-mail: tournaments@smilevent.net
      </pre>
      `
    }
  }
}

function sendEmail(emailType, model, emails) {
  return Users
    .findOne({
      where: {
        isSystemAdministrator: true
      },
      include: [{ model: SmtpCredentials, as: 'smtp' }]
    })
    .then(({ smtp }) => {
      const template = TEMPLATES[emailType](model);
      let decipher = require('crypto').createDecipher('aes192', 'ksa051saDIJ31032gka');
      let password = decipher.update(smtp.passwordHash, 'hex', 'utf8');
      password += decipher.final('utf8');

      const transporter = nodemailer.createTransport({
        host: smtp.service,
        port: '465',
        secure: true,
        auth: {
          user: smtp.username,
          pass: password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const options = {
        from: smtp.username,
        to: emails.join(', '),
        subject: template.subject,
        html: template.body
      }

      return transporter
        .sendMail(options)
        .then(() => {
          const templateFn = TEMPLATES[emailType + EmailType.NOTIFICATION];//(model);
          if (templateFn) {
            const template = templateFn(model);
            return transporter.sendMail({
              from: smtp.username,
              to: smtp.username,
              subject: template.subject,
              html: template.body
            });
          }
          else return null;
        });
    });
}


module.exports = {
  sendEmail
}