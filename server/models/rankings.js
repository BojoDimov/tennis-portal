const Matches = require('./matches');
const { Rankings } = require('../db');

function update(scheme, draw, trn) {
  let points = null;
  if (draw.schemeType == 'elimination')
    promise = Matches.generatePoints(scheme, draw.data, true);
  else {
    let matches = [];
    draw.data.forEach(group => matches = matches.concat(group.matches));
    points = Matches.generatePoints(scheme, matches, false);
  }

  if (!points)
    throw "cannot generate points";

  return Promise.resolve(points)
    .then(points => {
      let keys = Object.keys(points).filter(e => e != "null").map(e => parseInt(e));
      return Promise.all([points, Rankings.findAll({
        where: {
          userId: keys,
          tournamentId: scheme.TournamentEdition.Tournament.id
        },
        transaction: trn
      })])
    })
    .then(([points, rankings]) => {
      var create = Object.keys(points).filter(k => k != "null" && !rankings.find(r => r.userId == k)).map(k => {
        return {
          userId: k,
          tournamentId: scheme.TournamentEdition.tournamentId,
          points: points[k]
        };
      });
      return Promise.all(rankings.map(e => e.update({ points: e.points + points[e.userId] }, { transaction: trn }))
        .concat(Rankings.bulkCreate(create, { transaction: trn })));
    })
    .then(() => draw);
}

Rankings.update = update;

module.exports = Rankings;