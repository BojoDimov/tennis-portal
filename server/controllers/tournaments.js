const express = require('express');
const router = express.Router();
const {
  Tournaments,
  TournamentEditions,
  TournamentSchemes,
  Rankings,
  Users,
  Teams
} = require('../models');

const getAll = (req, res) => {
  Tournaments
    .findAll()
    .then(tournaments => res.send(tournaments));
};

const getTournament = (req, res) => {
  return Tournaments
    .findById(req.params.id, {
      include: [
        { model: TournamentEditions, as: 'editions' },
        {
          model: Rankings,
          as: 'ranking',
          include: [
            { model: Teams, as: 'team', include: Teams.getAggregateRoot() }
          ]
        }
      ],
      order: [
        [{ model: Rankings, as: 'ranking' }, 'points', 'desc']
      ]
    }).then(t => res.json(t))
};

const createTournament = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';
  let tournament = Tournaments.create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const editTournament = (req, res, next) => {
  return Tournaments
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
  return Tournaments
    .findById(id)
    .then(t => t.update({ status: status }));
}

router.get('/', getAll);
router.get('/:id', getTournament);
router.get('/:id/publish', publish);
router.get('/:id/draft', draft);
router.post('/', createTournament);
router.post('/edit', editTournament);
module.exports = router;