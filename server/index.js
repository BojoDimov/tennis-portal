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

app.use('/api', require('./controllers'));
app.use(require('../server/infrastructure/middlewares/error'));
