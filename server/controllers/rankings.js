const { Rankin } = require('../sequelize.config');

module.exports = {
  init: (app) => {
    app.get('/api/tournaments', getAll);
    app.get('/api/tournaments/:id', getTournament);
    app.post('/api/tournaments', createTournament);
    app.post('/api/tournaments/edit/:id', editTournament);
    app.get('/api/tournaments/:id/publish', publish);
    app.get('/api/tournaments/:id/draft', draft);
  }
};