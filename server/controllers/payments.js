const express = require('express');
const router = express.Router();

const get = (req, res) => {
  res.json({ test: 'Hello world' });
}

const post = (req, res) => {
  console.log(req.body, req.query);
}

router.get('/', get);
router.post('/', post);
module.exports = router;