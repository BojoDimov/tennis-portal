const Sequelize = require('sequelize');
const db = new Sequelize('tennis-portal-db', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

const User = db.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

// sequelize.sync()
//   .then(() => User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20)
//   }))
//   .then(jane => {
//     console.log(jane.toJSON());
//   });

const TournamentEdition = db.define('TournamentEdition', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  tournamentId: { type: Sequelize.INTEGER, allowNull: true },
  name: Sequelize.STRING,
  info: Sequelize.TEXT,
  players: Sequelize.INTEGER,
  registrationStart: Sequelize.DATE,
  registrationEnd: Sequelize.DATE,
  preRegistrationStart: { type: Sequelize.DATE, allowNull: true },
  tournamentDate: Sequelize.DATE,
  hasGroupPhase: Sequelize.BOOLEAN
});

TournamentEdition.sync();