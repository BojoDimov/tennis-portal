const Matches = require('./matches');
const Groups = require('./groups');
const Users = require('./users');
const { Sets, GroupTeams } = require('../db');
const DrawActions = require('../logic/drawActions');

function get(scheme, transaction, format = true) {
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
          'round', 'match',
          ['sets', 'order', 'asc']
        ],
        transaction: transaction
      })
      .then(matches => {
        return {
          schemeId: scheme.id,
          schemeType: scheme.schemeType,
          status: scheme.status,
          data: matches.map(match => {
            if (format)
              match.sets = match.sets.map(Matches.formatSet);
            return match;
          }),
          isLinked: scheme.groupPhaseId != null,
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
        ],
        transaction: transaction
      })
      .then(groups => {
        groups.forEach(group => {
          group.matches.forEach(match => {
            if (format)
              match.sets = match.sets.map(Matches.formatSet);
          });
        });

        return {
          schemeId: scheme.id,
          schemeType: scheme.schemeType,
          status: scheme.status,
          data: groups,
          isDrawn: groups.length > 0
        }
      });
}

function create(scheme, seed, teams) {
  if (scheme.schemeType == 'elimination') {
    let matches = DrawActions._draw_eliminations(scheme, seed, teams)
    return Matches.bulkCreate(matches);
  }
  else if (scheme.schemeType == 'round-robin') {
    let groups = DrawActions._draw_groups(scheme, seed, teams);
    return Promise.all(groups.map(group => Groups.create(group, {
      include: [
        { model: GroupTeams, as: 'teams' }
      ]
    })));
  }
}

function finalize(linkedScheme, draw, trn) {
  if (!linkedScheme)
    return null;

  return Promise.resolve(draw.data
    .map(group => Groups.orderByStatistics(group))
    .map(group => {
      return {
        team1: group.teams[0].User,
        team2: group.teams[1].User
      }
    }))
    .then(DrawActions._fill_groups)
    .then(DrawActions._draw_eliminations_from_groups)
    .then(matches => matches.map(match => {
      match.schemeId = linkedScheme.id;
      return match;
    }))
    .then(matches => Matches.bulkCreate(matches, { transaction: trn }))
    .then(() => draw);
}

module.exports = {
  get,
  create,
  finalize
};