const {
  Tournaments, TournamentEditions, TournamentSchemes,
  SchemeEnrollments, EnrollmentsQueue,
  Matches, Sets, Groups, GroupTeams,
  Users,
  db } = require('../sequelize.config');
const DrawActions = require('../logic/drawActions');
const EnrollmentsActions = require('../logic/enrollmentsActions');
const { formatSet } = require('./matches');

const getAll = (req, res) => {
  return TournamentSchemes
    .findAll()
    .then(schemes => res.json(schemes));
};

const get = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id, {
      include: [
        {
          model: TournamentEditions,
          include: [
            { model: Tournaments }]
        }
      ]
    })
    .then(e => res.json(e))
};

const create = (req, res, next) => {
  let model = req.body;
  model.status = 'draft';

  return TournamentSchemes.create(model)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const edit = (req, res, next) => {
  return TournamentSchemes
    .findById(req.body.id)
    .then(e => EnrollmentsActions._update(db, e, req.body))
    .then(e => e.update(req.body))
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
};

const publish = (req, res) => {
  return _set_status(req.params.id, 'published')
    .then(() => res.json({}));
}

const draft = (req, res) => {
  return _set_status(req.params.id, 'draft')
    .then(() => res.json({}));
}

const getEnrollments = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(e => EnrollmentsActions._get(db, e.id))
    .then(e => {
      return res.json(e);
    });
}

const getEnrollmentsQueue = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(e => EnrollmentsActions._get_queue(db, e.id))
    .then(e => {
      return res.json(e);
    });
}

const draw = (req, res, next) => {
  let scheme = null;
  let seed = parseInt(req.query.seed);

  return Matches
    .findAll({
      where: {
        schemeId: req.params.id
      }
    })
    .then(matches => {
      if (matches.length > 0 || !seed)
        throw null;
    })
    .catch(() => next({ name: 'DomainActionError', message: 'Invalid action: draw scheme' }, req, res, null))
    .then(() => TournamentSchemes.findById(req.params.id))
    .then(e => {
      scheme = e;
      return EnrollmentsActions._get(db, e.id)
    })
    .then(e => {
      if (scheme.schemeType == 'elimination') {
        let matches = DrawActions._draw_eliminations(scheme, seed, e)
        return Matches.bulkCreate(matches);
      }
      else if (scheme.schemeType == 'round-robin') {
        let groups = DrawActions._draw_groups(scheme, seed, e);
        return Promise.all(groups.map(group => Groups.create(group, {
          include: [
            { model: GroupTeams, as: 'teams' }
          ]
        })));
        //return Groups.bulkCreate(groups);
      }
    })
    .then(() => _get_draw_data(scheme))
    .then(data => res.json(data));
}

const getDraw = (req, res) => {
  return TournamentSchemes
    .findById(req.params.id)
    .then(scheme => _get_draw_data(scheme))
    .then(data => res.json(data));
}

module.exports = {
  init: (app) => {
    app.get('/api/schemes', getAll);
    app.get('/api/schemes/:id', get);
    app.post('/api/schemes', create);
    app.post('/api/schemes/edit/', edit);
    app.get('/api/schemes/:id/publish', publish);
    app.get('/api/schemes/:id/draft', draft);
    app.get('/api/schemes/:id/enrollments', getEnrollments);
    app.get('/api/schemes/:id/queue', getEnrollmentsQueue);
    app.get('/api/schemes/:id/draw', draw);
    app.get('/api/schemes/:id/getDraw', getDraw);
  }
};

function _set_status(id, status) {
  return TournamentSchemes
    .findById(id)
    .then(edition => edition.update({ status: status }));
}

function _get_draw_data(scheme) {
  if (scheme.schemeType == 'elimination')
    return Matches
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
          { model: Users, as: 'team2', attributes: ['id', 'fullname'] },
          { model: Sets, as: 'sets' }
        ],
        order: [
          'match',
          ['sets', 'order', 'asc']
        ]
      })
      .then(matches => {
        return {
          schemeId: scheme.id,
          schemeType: 'elimination',
          data: matches.map(match => {
            match.sets = match.sets.map(formatSet);
            return match;
          }),
          isDrawn: matches.length > 0
        }
      });
  else if (scheme.schemeType == 'round-robin')
    return Groups
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          {
            model: GroupTeams,
            as: 'teams',
            include: [
              { model: Users, attributes: ['id', 'fullname'] }
            ]
          },
          {
            model: Matches,
            as: 'matches',
            include: [
              { model: Users, as: 'team1', attributes: ['id', 'fullname'] },
              { model: Users, as: 'team2', attributes: ['id', 'fullname'] },
              { model: Sets, as: 'sets' }
            ]
          }
        ],
        order: [
          'group',
          ['teams', 'order', 'asc'],
          ['matches', 'sets', 'order', 'asc']
        ]
      })
      .then(groups => {
        groups.forEach(group => {
          group.matches.forEach(match => {
            match.sets = match.sets.map(formatSet);
          });
        });

        return {
          schemeId: scheme.id,
          schemeType: 'round-robin',
          data: groups,
          isDrawn: groups.length > 0
        }
      });
}