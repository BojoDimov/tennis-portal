const { Tournaments, TournamentEditions, TournamentSchemes, db } = require('../sequelize.config');
const { getEnrollments } = require('../db/enrollments.js');
const { drawScheme } = require('../logic/drawScheme');

const getAll = (req, res) => {
  TournamentSchemes
    .findAll()
    .then(schemes => res.send(schemes));
};

const getScheme = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id, {
      include: [
        {
          model: TournamentEditions,
          include: [
            { model: Tournaments }]
        }
      ]
    }).then(e => res.json(e))
};

const getSchemeEnrollments = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(e => getEnrollments(db, e.id, e.maxPlayerCount))
    .then(e => {
      console.log(e);
      return res.json(e);
    });
}

const testDraw = (req, res) => {
  let scheme = null;
  return TournamentSchemes
    .findById(req.params.id)
    .then(e => {
      scheme = e;
      return getEnrollments(db, e.id, e.maxPlayerCount)
    })
    .then(e => {
      return res.json(drawScheme(scheme, 8, e));
    });
}

const createScheme = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';
  TournamentSchemes.create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const editScheme = (req, res) => {

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
  return TournamentSchemes
    .findById(id)
    .then(edition => edition.update({ status: status }));
}

module.exports = {
  init: (app) => {
    app.get('/api/schemes', getAll);
    app.get('/api/schemes/:id', getScheme);
    app.post('/api/schemes', createScheme);
    app.post('/api/schemes/edit/:id', editScheme);
    app.get('/api/schemes/:id/publish', publish);
    app.get('/api/schemes/:id/draft', draft);
    app.get('/api/schemes/:id/enrollments', getSchemeEnrollments);
    app.get('/api/schemes/:id/testDraw', testDraw);
  }
};
