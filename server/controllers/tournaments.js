const { Tournaments, TournamentEditions, TournamentSchemes, Rankings, Users } = require('../sequelize.config');

const getAll = (req, res) => {
  Tournaments
    .findAll()
    .then(tournaments => res.send(tournaments));
};

const getTournament = (req, res) => {
  return Tournaments
    .findById(req.params.id, {
      include: [
        { model: TournamentEditions, as: 'editions' }
      ]
    }).then(t => res.json(t))
};

const createTournament = (req, res) => {
  let model = req.body;
  model.status = 'draft';
  let tournament = Tournaments.create(model)
    .then(e => res.json(e));
};

const editTournament = (req, res) => {

};

const publish = (req, res) => {
  setStatus(req.params.id, 'published')
    .then(() => res.json({}));
}

const draft = (req, res) => {
  setStatus(req.params.id, 'draft')
    .then(() => res.json({}));
}

function setStatus(id, status) {
  return Tournaments
    .findById(id)
    .then(t => t.update({ status: status }));
}

// const getRankings = (req, res) => {
//   return Rankings.findAll({
//     where: {
//       Tournament
//     }
//   })
// }

const getAllRankings = (req, res) => {
  return Rankings.findAll({
    include: [
      {
        model: Users,
        attributes: ['id', 'fullname']
      },
      {
        model: Tournaments
      }]
  })
    .then(rankings => res.json(rankings));
}

module.exports = {
  init: (app) => {
    app.get('/api/tournaments', getAll);
    app.get('/api/tournaments/:id', getTournament);
    app.post('/api/tournaments', createTournament);
    app.post('/api/tournaments/edit/:id', editTournament);
    app.get('/api/tournaments/:id/publish', publish);
    app.get('/api/tournaments/:id/draft', draft);
    app.get('/api/rankings', getAllRankings);
  }
};