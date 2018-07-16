const db = require('./db');
db.sequelize.sync({ force: false }).then(() => process.exit());