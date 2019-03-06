require('dotenv').config();
const { sequelize } = require('./db');
sequelize
  .sync()
  .then(_ => { console.log('successfull'); process.exit() })
  .catch(err => { console.log('Error: ', err); process.exit() });