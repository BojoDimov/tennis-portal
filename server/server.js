const express = require('express');
const app = express();
const cors = require('cors');
// const env = process.argv.slice(-1)[0];
const env = process.env.NODE_ENV || 'dev';
const config = require('../config')[env];

app.listen(config.port, () => console.log(`
using configuration "${env}":
server listening on port ${config.port}`));

app.use(cors());

app.use('/', express.static('build'));
app.use(
  '/endpoints/payments',
  require('body-parser').urlencoded({ extended: true }),
  require('./controllers/payments')
);
app.use('/api/files', require('./controllers/files'));
app.use('/api', express.json(), require('./controllers'));

app.get('*', (req, res) => {
  res.sendFile('build/index.html', { root: './' });
});

app.use(require('./middlewares/errors'));
