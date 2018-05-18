const { Tournaments, TournamentEditions, TournamentSchemes } = require('../sequelize.config');

const getAll = (req, res) => {
  TournamentEditions
    .findAll()
    .then(editions => res.send(editions));
};

const getEditions = (req, res) => {
  const result = {};
  TournamentEditions
    .findById(req.params.id, {
      include: [
        { model: Tournaments, required: true }
      ]
    })
    .then(e => {
      result.edition = e;
      result.tournament = e.Tournament;
      return e.getTournamentSchemes();
    })
    .then(schemes => {
      result.schemes = schemes;
      res.json(result);
    });
};

const createEdition = (req, res) => {
  let model = req.body;
  model.status = 'draft';
  let edition = TournamentEditions.create(model)
    .then(e => res.json(e));
};

const editEdition = (req, res) => {

};

module.exports = {
  init: (app) => {
    app.get('/api/editions', getAll);
    app.get('/api/editions/:id', getEditions);
    app.post('/api/editions', createEdition);
    app.post('/api/editions/edit/:id', editEdition);
  }
};