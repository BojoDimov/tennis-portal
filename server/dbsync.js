require('dotenv').config();
const { sequelize } = require('./db');
sequelize
  .sync()
  .then(_ => process.exit())
  .catch(_ => process.exit());