require('dotenv').config();
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Sofia");
const path = require('path');
const fs = require('fs');
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

if (process.env.TYPE == 'prod') {
  // This is needed because in dev, webpack is handling the refresh for me,
  // but in production I am doing everything, and deep-links are not working properly
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
}