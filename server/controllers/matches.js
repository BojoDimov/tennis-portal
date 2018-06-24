const {
  Matches, EnrollmentsQueue, SchemeEnrollments, Users
} = require('../sequelize.config');

const removeTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return Matches
    .findById(req.params.id, {
      include: [
        { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
        { model: Users, as: 'team2', attributes: ['id', 'fullname'] }
      ]
    })
    .then(match => {
      let team = null;
      if (pos == 1) {
        team = match.team1;
        match.team1Id = null;
        match.seed1 = null;
      }
      else {
        team = match.team2;
        match.team2Id = null;
        match.seed2 = null;
      }

      let p1 = SchemeEnrollments.destroy({
        where: {
          schemeId: match.schemeId,
          userId: team.id
        }
      });

      let p2 = EnrollmentsQueue.create({ schemeId: match.schemeId, userId: team.id });

      let p3 = match.save();

      return Promise.all([p1, p2, p3]);
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const setTeam = (req, res, next) => {
  let pos = parseInt(req.query['pos']);
  if (!pos || (pos != 1 && pos != 2))
    res.status(400).send();

  return Matches
    .findById(req.params.id, {
      include: [
        { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
        { model: Users, as: 'team2', attributes: ['id', 'fullname'] }
      ]
    })
    .then(match => {
      if (pos == 1)
        match.team1Id = req.query['teamId'];
      else
        match.team2Id = req.query['teamId'];

      let p1 = EnrollmentsQueue.destroy({
        where: {
          schemeId: match.schemeId,
          userId: req.query['teamId']
        }
      });

      let p2 = SchemeEnrollments.create({ schemeId: match.schemeId, userId: req.query['teamId'] });

      let p3 = match.save();

      return Promise.all([p1, p2, p3]);
    })
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

module.exports = {
  init: (app) => {
    app.get('/api/matches/:id/removeTeam', removeTeam);
    app.get('/api/matches/:id/setTeam', setTeam);
  }
};