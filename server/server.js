require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.listen(process.env.PORT, () => console.log(`
using configuration "${process.env}":
server listening on port ${process.env.PORT}`));

app.use(cors());

app.use('/api/payments', require('./controllers/payments'));
app.use('/diagnostics', express.json(), require('./diagnostics'));
app.use('/api/files', require('./controllers/files'));
app.use('/api', express.json(), require('./controllers'));
app.use(require('./middlewares/errors'));

app.use('/admin', express.static('admin/build'));
app.get('/admin/*', (req,res) => {
  res.sendFile('admin/build/index.html', { root: './' });
});
app.use('/', express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile('client/build/index.html', { root: './' });
});