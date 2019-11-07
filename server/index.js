require('dotenv').config();
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Sofia");
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

app.listen(process.env.PORT, () => console.log(`server running @ port:${process.env.PORT}`));

app.use(require('cors')());
app.use('/api', express.json(), require('./controllers'));
app.use('/api/files', require('./infrastructure/files.controller'));
app.use(require('./infrastructure/middlewares/error'));

if (process.env.TYPE == 'prod') {
  // This is needed because in dev, webpack is handling the refresh for me,
  // but in production I am doing everything, and deep-links are not working properly
  app.use(/^.*js$/, (req, res, next) => {
    const file = req.baseUrl.split('/').reverse()[0];
    res.sendFile(path.join(
      __dirname,
      process.env.DOCUMENT_ROOT,
      'static/js',
      file
    ));
  });

  app.use(/^.*(png|jpeg|jpg)$/, (req, res, next) => {
    const file = req.baseUrl.split('/').reverse()[0];
    res.sendFile(path.join(
      __dirname,
      process.env.DOCUMENT_ROOT,
      'assets',
      file
    ));
  });

  app.use(/^.*css$/, (req, res, next) => {
    const file = req.baseUrl.split('/').reverse()[0];
    const staticFile = path.join(__dirname, process.env.DOCUMENT_ROOT, 'static/css', file);
    const preloadedCss = path.join(__dirname, process.env.DOCUMENT_ROOT, 'css', file);
    if (fs.existsSync(staticFile))
      res.sendFile(staticFile);
    else
      res.sendFile(preloadedCss);
  });

  app.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, process.env.DOCUMENT_ROOT, 'index.html'));
  });
}