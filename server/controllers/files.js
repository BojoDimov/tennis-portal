const express = require('express');
const router = express.Router();
var multer = require('multer')();
const { Files } = require('../models');

const upload = (req, res, next) => {
  if (req.file.mimetype.indexOf('image') == -1)
    next({ name: 'DomainActionError', message: 'Invalid scheme' }, req, res, null);

  return Files
    .create({
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      content: req.file.buffer
    })
    .then(e => res.json({ name: e.name, mimeType: e.mimeType, id: e.id }));
}

const get = (req, res, next) => {
  return Files
    .findById(req.params.id)
    .then(e => res.send(e.content));
}

router.get('/:id', get);
router.post('/', multer.single('file'), upload);

module.exports = router;