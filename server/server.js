let express = require("express");
let app = express();

//plugins
let cors = require('cors');

//controllers
let Tournaments = require('./controllers/tournaments');
let Editions = require('./controllers/editions');
let Schemes = require('./controllers/schemes');
let Users = require('./controllers/users');

//sequelize models
let { Logs } = require('./sequelize.config');

//define plugins
app.use(cors());
app.use(express.json());

app.listen(3100, () => console.log('Server listening...'));

//wire controllers
Tournaments.init(app);
Editions.init(app);
Schemes.init(app);
Users.init(app);

//error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const result = {}
    err.errors.forEach(e => result[e.path] = e.message);
    res.status(422).send(result);
  }
  else Logs.create({
    ip: req.ip,
    path: req.path,
    method: req.method,
    body: JSON.stringify(req.body),
    params: JSON.stringify(req.params),
    query: JSON.stringify(req.query),
    error: JSON.stringify(err)
  }).then(() => res.status(500).end());
});