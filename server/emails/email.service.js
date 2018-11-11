const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
  Emails,
  UserActivationCodes
} = require('../db');
const { EmailType, EmailStatus } = require('../infrastructure/enums');

const footer = `
<br>
---------------------------------------------------------------
<br>
Този имейл е автоматично генериран, моля не изпращайте отговор.
<br>
За контакти и информация:
<br>
тел: 0892777925
<br>
e-mail: tours@tennisdiana.com
`;

class EmailService {
  async createRegistrationEmail(model) {
    let token = crypto.randomBytes(16).toString('hex');
    let url = `http://${process.env.CLIENT_HOST}/account/activation?token=${token}`;
    let expires = new Date();
    expires.setHours(expires.getHours() + 24);

    let email = {
      to: model.email,
      type: EmailType.REGISTRATION,
      status: EmailStatus.PENDING,
      subject: 'Активиране на акаунт в Тенис клуб Диана',
      body: `
      Здравейте ${model.name},
      <br>
      Вашият акаунт беше успешно създаден. Моля за да го активирате, последвайте следният 
      <a href="${url}">линк</a>
      ` + footer
    };

    email = await Emails.create(email);
    await UserActivationCodes.create({ userId: model.id, token, expires });

    try {
      await this.sendEmail(email);
      await email.update({ status: EmailStatus.SENT });
    }
    catch (err) {
      await email.update({ status: EmailStatus.FAILED });
      throw err;
    }
  }

  async sendEmail(email) {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const options = {
      from: process.env.SMTP_USERNAME,
      to: email.to,
      subject: email.subject,
      html: email.body
    };

    return await transporter.sendMail(options);
  }
}

module.exports = new EmailService();