const Matches = require('./matches');
const Groups = require('./groups');

module.exports = {
  getDrawData: function (scheme, transaction, format = true) {
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
            data: matches.map(match => {
              if (format)
                match.sets = match.sets.map(Matches.formatSet);
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
            data: groups,
            isDrawn: groups.length > 0
          }
        });
  }
}