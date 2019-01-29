require('dotenv').config();
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Sofia");
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.listen(process.env.PORT, () => console.log(`server running @ port:${process.env.PORT}`));
app.use(cors());
app.use(express.json());

app.use('/api', require('../server/controllers'));
app.use(require('../server/infrastructure/middlewares/error'));

app.use(/^.*js$/, (req, res, next) => {
  const file = req.baseUrl.split('/').reverse()[0];
  res.sendFile(path.join(__dirname, 'static/js', file));
});

app.use(/^.*(png|jpeg)$/, (req, res, next) => {
  const file = req.baseUrl.split('/').reverse()[0];
  res.sendFile(path.join(__dirname, 'assets', file));
});

app.use(/^.*css$/, (req, res, next) => {
  const file = req.baseUrl.split('/').reverse()[0];
  const staticFile = path.join(__dirname, 'static/css', file);
  const preloadedCss = path.join(__dirname, 'css', file);
  if (fs.existsSync(staticFile))
    res.sendFile(staticFile);
  else
    res.sendFile(preloadedCss);
});

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});