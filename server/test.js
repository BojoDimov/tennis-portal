const DrawActions = require('./logic/drawActions');
const Draws = require('./models/draws');
const Groups = require('./models/groups');

const { TournamentSchemes, db } = require('./db');

TournamentSchemes
  .findById(4)
  .then(scheme => Draws.getDrawData(scheme, null, false))
  .then(draw => draw.data.map(group => Groups.orderByStatistics(group)))
  .then(groups => groups.map(group => {
    return {
      team1: group.teams[0],
      team2: group.teams[1]
    }
  }))
  .then(DrawActions._fill_groups)
  .then(DrawActions._draw_eliminations_from_groups)
  .then(matches => {
    console.log(matches.map(match => `${match.team1.User.fullname} vs ${match.team2.User.fullname}`));
    process.exit();
  })
  .catch(process.exit);