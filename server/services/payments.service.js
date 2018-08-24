const crypto = require('crypto');
const env = process.env.NODE_ENV || 'dev';
const config = require('../../config')[env].paymentsConfig;
const { sequelize } = require('../db');
const { Op } = require('../db').Sequelize;
const {
  Payments,
  Enrollments,
  TournamentSchemes,
  TournamentEditions
} = require('../models');
const { cancelUserEnrollment } = require('../services/scheme.service');
const { PaymentStatus, EmailType } = require('../enums');
const { sendEmail } = require('../emailService');

console.log('Payments config:\n', config);

function encodePayment(schemeId, userId) {
  return Enrollments
    .getEnrollmentData(userId, schemeId)
    .then(data => {
      if (!data)
        return null;
      else
        return Payments
          .findOne({
            where: {
              schemeId: schemeId,
              [Op.or]: {
                user1Id: userId,
                user2Id: userId
              }
            },
            include: [
              {
                model: TournamentSchemes, as: 'scheme',
                include: [{ model: TournamentEditions }]
              }
            ]
          })
          .then(payment => {
            if (!payment)
              return null;

            let hmac = require('crypto').createHmac('sha1', config.secret);
            let data = `MIN=${config.min}
INVOICE=${payment.id}
AMOUNT=${payment.amount}
CURRENCY=BGN
EXP_TIME=01.08.2050
DESCR=Плащане такса турнир ${payment.scheme.name}
ENCODING=utf-8`;
            let encoded = new Buffer(data).toString('base64');
            let checksum = hmac.update(encoded).digest('hex');
            return {
              invoice: payment.id,
              amount: payment.amount,
              scheme: payment.scheme,
              status: payment.status,
              encoded: encoded,
              checksum: checksum
            }
          });
    });
}

function decodePayment(encoded, checksum) {
  let hmac = require('crypto').createHmac('sha1', config.secret);
  let reject = (hmac.update(encoded).digest('hex') != checksum);
  let decoded = new Buffer(encoded, 'base64').toString('utf-8');

  return Promise
    .all(decoded
      .split('\n')
      .map(e => parseInvoice(e))
      .filter(e => e != null)
      .map(e => handleInvoice(e, reject)));
}

function parseInvoice(raw) {
  let parsed = raw.match(/^INVOICE=(\d+):STATUS=(PAID|DENIED|EXPIRED)(:PAY_TIME=(\d+):STAN=(\d+):BCODE=([0-9a-zA-Z]+))?$/);
  if (!parsed)
    return null;
  return {
    invoice: parsed[1],
    status: parsed[2]
  };
}

function handleInvoice(model, reject) {
  console.log(`Handling of INVOICE=${model.invoice}; REJECT=${reject}`);
  return sequelize
    .transaction(function (trn) {
      //TODO: handle expired state by recreating the payment
      if (reject)
        throw null;

      return Payments
        .findById(model.invoice)
        .then(payment => {
          if (!payment)
            throw null;

          if (model.status == 'DENIED')
            return cancelUserEnrollment(payment.schemeId, payment.user1Id)
          else
            return Promise
              .all([
                payment.update({ status: PaymentStatus.PAID }, { transaction: trn }),
                Enrollments.getEnrollmentData(payment.user1Id, payment.schemeId)
              ])
              .then(([payment, enrollment]) => enrollment.update({ isPaid: true }, { transaction: trn }))
              // .then(([payment, enrollment]) => {
              //   enrollment.isPaid = true;
              //   return enrollment.save({ transaction: trn });
              // })
              .then(enrollment => sendEmail(EmailType.PAYMENT_ACCEPTED, {
                name: enrollment.scheme.TournamentEdition.name + ' - ' + enrollment.scheme.name
              }, [enrollment.team.user1.email].concat((enrollment.team.user2 ? [enrollment.team.user2.email] : []))));
        })
    })
    .then(() => `INVOICE=${model.invoice}:STATUS=OK`)
  //.catch(err => `INVOICE=${model.invoice}:STATUS=ERR`);
}

module.exports = {
  encodePayment,
  decodePayment
}