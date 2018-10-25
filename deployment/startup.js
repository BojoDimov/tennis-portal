require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.listen(process.env.PORT, () => console.log(`server running @ port:${process.env.PORT}`));
app.use(cors());
app.use(express.json());

//console.log("Static files root:", path.join(__dirname, '../public', 'index.html'));
// app.use('*.js', function (req, res, next) {
//   const file = req.baseUrl + '.gz';
//   res.set('Content-Encoding', 'gzip');
//   return res.sendFile(path.join(__dirname, file));
//   // next();
// });

app.use('/api', require('../server/controllers'));
app.use(require('../server/infrastructure/middlewares/error'));

app.use(/^.*js$/, (req, res, next) => {
  const file = req.baseUrl.split('/').reverse()[0];
  res.sendFile(path.join(__dirname, file));
});

app.use(/^.*(png|jpeg)$/, (req, res, next) => {
  const file = req.baseUrl.split('/').reverse()[0];
  res.sendFile(path.join(__dirname, 'assets', file));
});

app.use(/^.*css$/, (req, res, next) => {
  const file = req.baseUrl.split('/').reverse()[0];
  res.sendFile(path.join(__dirname, 'css', file));
});

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});