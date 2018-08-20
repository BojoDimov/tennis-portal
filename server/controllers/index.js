const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.use('/login', require('./login'));
router.use('/news', require('./news'));
router.use('/users', require('./users'));
router.use('/invitations', auth, require('./invitations'));
router.use('/tournaments', auth, require('./tournaments'));
router.use('/editions', require('./editions'));
router.use('/schemes', require('./schemes'));
router.use('/groups', auth, require('./groups'));
router.use('/matches', require('./matches'));
router.use('/payments', require('./payments'));

module.exports = router;