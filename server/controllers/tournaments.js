const { Tournaments, TournamentEditions, TournamentSchemes } = require('../sequelize.config');

const getAll = (req, res) => {
  Tournaments
    .findAll()
    .then(tournaments => res.send(tournaments));
};

const getTournament = (req, res) => {
  const result = {};
  Tournaments
    .findById(req.params.id)
    .then(t => {
      result.tournament = t;
      return t.getTournamentEditions();
    })
    .then(editions => {
      result.editions = editions;
      res.json(result);
    });
};

const createTournament = (req, res) => {
  let model = req.body;
  model.status = 'draft';
  let tournament = Tournaments.create(model)
    .then(e => res.json(e));
};

module.exports = {
  init: (app) => {
    app.get('/api/tournaments', getAll);
    app.get('/api/tournaments/:id', getTournament);
    app.post('/api/tournaments', createTournament);
  }
};