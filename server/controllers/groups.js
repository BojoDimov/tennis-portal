const {
  Groups, GroupTeams, EnrollmentsQueue, SchemeEnrollments, db
} = require('../sequelize.config');

const MatchActions = require('../logic/matchActions');

const removeTeam = (req, res, next) => {
  let teamId = req.query.teamId;

  return db
    .transaction(function (trn) {
      let p1 = GroupTeams
        .findOne({
          where: {
            groupId: req.params.id,
            teamId: teamId
          }
        })
        .then(gt => {
          gt.teamId = null;
          return gt.save({ transaction: trn });
        });

      let p2 = Groups
        .findById(req.params.id)
        .then(group => MatchActions.transfer(SchemeEnrollments, EnrollmentsQueue, group.schemeId, teamId, trn));

      return Promise.all([p1, p2]);
    })
    .then(r => res.json(r))
    .catch(err => next(err, req, res, null));
}

const addTeam = (req, res, next) => {
  let teamId = parseInt(req.query['teamId']);
  return db
    .transaction(function (trn) {
      let p1 = GroupTeams
        .findById(req.query.groupTeamId, { transaction: trn })
        .then(gt => {
          gt.teamId = teamId
          return gt.save();
        });

      let p2 = Groups
        .findById(req.params.id, { transaction: trn })
        .then(group => MatchActions.transfer(EnrollmentsQueue, SchemeEnrollments, group.schemeId, teamId, trn));

      return Promise.all([p1, p2]);
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

module.exports = {
  init: (app) => {
    app.get('/api/groups/:id/removeTeam', removeTeam);
    app.get('/api/groups/:id/addTeam', addTeam);
  }
}