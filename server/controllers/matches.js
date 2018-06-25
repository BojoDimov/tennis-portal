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

const addResult = (req, res, next) => {
  let sets = req.body.sets;
  let withdraw = req.body.withdraw;
  let matchId = req.params.id;

  sets = sets.map(parseSet);
  console.log(sets);
}

const scoreParser = /^(\d+)(\(\d+\))*$/;

function parseSet(set) {
  if (!set.team1 || !set.team2)
    throw "invalid score format";

  let t1m = set.team1.match(scoreParser);
  let t2m = set.team2.match(scoreParser);
  if ((t1m[2] && t2m[2]) || t1m.length < 2 || t2m.length < 2)
    throw "invalid score format";

  set.team1 = parseInt(t1m[1]);
  set.team2 = parseInt(t2m[1]);

  if (t1m[2])
    set.tiebreaker = parseInt(t1m[2].slice(1, t1m[2].length - 1));
  else if (t2m[2])
    set.tiebreaker = parseInt(t2m[2].slice(1, t2m[2].length - 1));
  else set.tiebreaker = null;

  return set;
}

module.exports = {
  init: (app) => {
    app.get('/api/matches/:id/removeTeam', removeTeam);
    app.get('/api/matches/:id/setTeam', setTeam);
    app.post('/api/matches/:id/addResult', addResult);
  }
};