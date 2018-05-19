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
    .then(edition => edition.update({ status: status }));
}

module.exports = {
  init: (app) => {
    app.get('/api/tournaments', getAll);
    app.get('/api/tournaments/:id', getTournament);
    app.post('/api/tournaments', createTournament);
    app.post('/api/tournaments/edit/:id', editTournament);
    app.get('/api/tournaments/:id/publish', publish);
    app.get('/api/tournaments/:id/draft', draft);
  }
};