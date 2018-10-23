const router = require('express').Router();

router.use('/tournaments', require('./tournament/tournament.controller'));
router.use('/editions', require('./edition/edition.controller'));
router.use('/schemes', require('./scheme/scheme.controller'));
router.use('/enrollments', require('./enrollment/enrollment.controller'));
router.use('/teams', require('./team/team.controller'));
router.use('/login', require('./user/login.controller'));
router.use('/users', require('./user/user.controller'));
router.use('/schedule', require('./schedule/schedule.controller'));

module.exports = router;
