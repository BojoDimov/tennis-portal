// require('./sequelize.config').init();

const { Tournaments, TournamentEditions } = require('./sequelize.config');

Tournaments
  .findById(1)
  .then(tournament => {
    return tournament
      .getTournamentEditions()
      .map(editions => tournament.editions = editions)
  })
  .then(t => console.log(t));