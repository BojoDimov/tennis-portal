const Matches = require('./matches');
const Groups = require('./groups');
const Users = require('./users');
const Teams = require('./teams');
const { Sets, GroupTeams } = require('../db');
const DrawActions = require('../logic/drawActions');

function get(scheme, transaction, format = true) {
  if (scheme.schemeType == 'elimination')
    return Matches
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: Matches.getIncludes(),
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
              { model: Teams, as: 'team', include: Teams.getAggregateRoot() }
            ]
          },
          {
            model: Matches,
            as: 'matches',
            include: Matches.getIncludes()
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
        team1: group.teams[0].team,
        team2: group.teams[1].team
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