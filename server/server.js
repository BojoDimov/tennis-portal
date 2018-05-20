let express = require("express");
let app = express();

var passport = require('passport');
var HttpBearerStrategy = require('passport-http-bearer').Strategy;

//sequelize models
let { Logs, Tokens } = require('./sequelize.config');

passport.use(new HttpBearerStrategy((token, next) => {
  Tokens.findOne({
    where: {
      token: token
    }
  }).then(token => {
    if (token) next(null, true);
    else next(null, false);
  }).catch(err => next(err));
}));

//plugins
let cors = require('cors');

//controllers
let Tournaments = require('./controllers/tournaments');
let Editions = require('./controllers/editions');
let Schemes = require('./controllers/schemes');
let Users = require('./controllers/users');

//define plugins
app.use(cors());
app.use(express.json());

app.listen(3100, () => console.log('Server listening...'));

//wire controllers
Tournaments.init(app);
Editions.init(app);
Schemes.init(app);
Users.init(app);

app.get('/test',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.json({ authenticated: true });
  });

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