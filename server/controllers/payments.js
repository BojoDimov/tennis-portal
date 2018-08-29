const express = require('express');
const router = express.Router();
const { Teams, Users, Payments, SmtpCredentials } = require('../models');
const { notifyTeam } = require('../services/scheme.service');
const { decodePayment, encodePayment } = require('../services/payments.service');
const { PaymentStatus } = require('../enums');


const get = (req, res, next) => {
  return Payments
    .findById(req.params.id)
    .then(p => encodePayment(p.schemeId, p.user1Id))
    .then(e => res.json(e));
}

const post = (req, res, next) => {
  return decodePayment(req.body.encoded, req.body.checksum)
    .then(handled => {
      res.set('Content-Type: text/plain');
      res.send(handled.join('\n'));
    })
    .catch(err => next(err, req, res, null));
}

const pending = (req, res, next) => {
  return Payments
    .findById(req.params.id)
    .then(p => {
      if (p.status == PaymentStatus.UNPAID)
        return p.update({ status: PaymentStatus.PENDING });
      else return p;
    })
    .then(p => res.json(p));
}

router.get('/:id/pending', express.json(), pending);
router.get('/:id', get);
router.post('/', require('body-parser').urlencoded({ extended: true }), post);
module.exports = router;