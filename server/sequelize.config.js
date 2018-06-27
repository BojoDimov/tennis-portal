const Sequelize = require('sequelize');

const db = new Sequelize('tennis-portal-db', 'postgres', '12345678', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

const Users = db.import(__dirname + '/db/users.js');
const Logs = db.import(__dirname + '/db/logs.js');
const Tokens = db.import(__dirname + '/db/tokens.js');
const Tournaments = db.import(__dirname + '/db/tournaments.js');
const TournamentEditions = db.import(__dirname + '/db/tournamentEditions.js');
const TournamentSchemes = db.import(__dirname + '/db/tournamentSchemes.js');
const SchemeEnrollments = db.import(__dirname + '/db/schemeEnrollments.js');
const EnrollmentsQueue = db.import(__dirname + '/db/enrollmentsQueue.js');
const Rankings = db.import(__dirname + '/db/rankings.js');
const Matches = db.import(__dirname + '/db/matches.js');
const Groups = db.import(__dirname + '/db/groups.js');
const GroupTeams = db.import(__dirname + '/db/groupTeams.js');
const Sets = db.import(__dirname + '/db/sets.js');

Users.hasOne(Tokens, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Users.hasMany(Rankings, {
  as: 'ranking',
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Tournaments.hasMany(TournamentEditions, {
  as: 'editions',
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

Tournaments.hasMany(Rankings, {
  as: 'ranking',
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

Rankings.belongsTo(Users, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

Rankings.belongsTo(Tournaments, {
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

TournamentEditions.belongsTo(Tournaments, {
  foreignKey: {
    name: 'tournamentId',
    allowNull: false
  }
});

TournamentEditions.hasMany(TournamentSchemes, {
  as: 'schemes',
  foreignKey: {
    name: 'tournamentEditionId',
    allowNull: false
  }
});

TournamentSchemes.belongsTo(TournamentEditions, {
  foreignKey: {
    name: 'tournamentEditionId',
    allowNull: false
  }
});

TournamentSchemes.hasMany(SchemeEnrollments, {
  as: 'enrollments',
  foreignKey: {
    name: 'schemeId',
    allowNull: false
  }
});

TournamentSchemes.hasMany(EnrollmentsQueue, {
  as: 'enrollmentsQueue',
  foreignKey: {
    name: 'schemeId',
    allowNull: false
  }
});

TournamentSchemes.hasOne(TournamentSchemes, {
  foreignKey: {
    name: 'groupPhaseId',
    allowNull: true
  }
});

SchemeEnrollments.belongsTo(Users, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
    unique: 'Enrollments_Scheme_Team_UQ'
  }
});

SchemeEnrollments.belongsTo(TournamentSchemes, {
  foreignKey: {
    name: 'schemeId',
    allowNull: false,
    unique: 'Enrollments_Scheme_Team_UQ'
  }
});

EnrollmentsQueue.belongsTo(Users, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
    unique: 'EnrollmentsQueues_Scheme_Team_UQ'
  }
});

EnrollmentsQueue.belongsTo(TournamentSchemes, {
  foreignKey: {
    name: 'schemeId',
    allowNull: false,
    unique: 'EnrollmentsQueues_Scheme_Team_UQ'
  }
});

Matches.belongsTo(Users, {
  as: 'team1',
  foreignKey: {
    name: 'team1Id',
    allowNull: true
  }
});

Matches.belongsTo(Users, {
  as: 'team2',
  foreignKey: {
    name: 'team2Id',
    allowNull: true
  }
});

TournamentSchemes.hasMany(Matches, {
  foreignKey: {
    name: 'schemeId',
    allowNull: false
  }
});

Sets.belongsTo(Matches, {
  foreignKey: {
    name: 'matchId',
    allowNull: false
  }
});

Matches.hasMany(Sets, {
  as: 'sets',
  foreignKey: {
    name: 'matchId',
    allowNull: false
  }
});

Matches.belongsTo(Groups, {
  foreignKey: {
    name: 'groupId',
    allowNull: true
  }
});

GroupTeams.belongsTo(Users, {
  foreignKey: {
    name: 'teamId',
    allowNull: true
  }
});

GroupTeams.belongsTo(Groups, {
  foreignKey: {
    name: 'groupId',
    allowNull: true
  }
});

Groups.hasMany(GroupTeams, {
  as: 'teams',
  foreignKey: {
    name: 'groupId',
    allowNull: true
  }
});

Groups.hasMany(Matches, {
  as: 'matches',
  foreignKey: {
    name: 'groupId',
    allowNull: true
  }
});

// Groups.hasMany(Users, { through: GroupTeams });

Groups.belongsTo(TournamentSchemes, {
  foreignKey: {
    name: 'schemeId',
    allowNull: true
  }
});



// TournamentSchemes.hasMany(Groups, {
//   as: 'groups',
//   foreignKey: {
//     name: 'schemeId',
//     allowNull: false
//   }
// });

module.exports = {
  Users, Tokens,
  Tournaments, TournamentEditions, TournamentSchemes, Rankings,
  SchemeEnrollments, EnrollmentsQueue,
  Matches, Groups, GroupTeams, Sets,
  Logs,
  db,
  init: function () {
    return db.sync({ force: true }).then(() => process.exit());
  }
};