const { Tournaments, TournamentEditions, TournamentSchemes } = require('../sequelize.config');

const getAll = (req, res) => {
  TournamentEditions
    .findAll()
    .then(editions => res.send(editions));
};

const getEditions = (req, res) => {
  return TournamentEditions
    .findById(req.params.id, {
      include: [
        { model: TournamentSchemes, as: 'schemes' },
        { model: Tournaments }
      ]
    })
    .then(e => res.json(e));
};

const createEdition = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';
  let edition = TournamentEditions.create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const editEdition = (req, res, next) => {
  return TournamentEditions
    .findById(req.body.id)
    .then(e => e.update(req.body))
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
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
  return TournamentEditions
    .findById(id)
    .then(edition => edition.update({ status: status }));
}

module.exports = {
  init: (app) => {
    app.get('/api/editions', getAll);
    app.get('/api/editions/:id', getEditions);
    app.post('/api/editions', createEdition);
    app.post('/api/editions/edit/', editEdition);
    app.get('/api/editions/:id/publish', publish);
    app.get('/api/editions/:id/draft', draft);
  }
};

