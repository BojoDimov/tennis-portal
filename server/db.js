const config = {
  database: "tennis-portal-experimental",
  username: "postgres",
  password: "12345678",
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
};
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config);

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,

  News: sequelize.import('./news/news.model.js'),
  Users: sequelize.import('./user/user.model.js'),
  Teams: sequelize.import('./team/team.model.js'),

  Tournaments: sequelize.import('./tournament/tournament.model.js'),
  Editions: sequelize.import('./edition/edition.model.js'),
  Schemes: sequelize.import('./scheme/scheme.model.js'),
  Enrollments: sequelize.import('./enrollment/enrollment.model.js'),
  Rankings: sequelize.import('./ranking/ranking.model.js'),

  Groups: sequelize.import('./group/group.model.js'),
  GroupTeams: sequelize.import('./group/groupTeam.model.js'),
  Matches: sequelize.import('./match/match.model.js'),
  Sets: sequelize.import('./match/set.model.js'),

  Tokens: sequelize.import('./infrastructure/models/token.model.js'),
  Logs: sequelize.import('./infrastructure/models/log.model.js'),
  Files: sequelize.import('./infrastructure/models/file.model.js'),
  SmtpCredentials: sequelize.import('./infrastructure/models/smtp.model.js'),
  UserActivationCodes: sequelize.import('./infrastructure/models/uac.model.js')
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;