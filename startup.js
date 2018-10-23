const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.listen(4000, () => console.log('server running @ port:4000'));
app.use(cors());
app.use(express.json());

//console.log("Static files root:", path.join(__dirname, '../public', 'index.html'));
app.use('*.js', function (req, res, next) {
  const file = req.baseUrl + '.gz';
  res.set('Content-Encoding', 'gzip');
  return res.sendFile(path.join(__dirname, file));
  // next();
});

app.use(express.static(__dirname));

app.use('/api', require('../server/index'));
app.use(require('../server/infrastructure/middlewares/error'));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
});