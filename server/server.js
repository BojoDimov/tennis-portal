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
    if (token && token.expires > new Date()) next(null, true);
    else next(null, false);
  }).catch(err => next(err));
}));

//plugins
let cors = require('cors');

//controllers
let Tournaments = require('./controllers/tournaments');
let Editions = require('./controllers/editions');
let Schemes = require('./controllers/schemes');
let Matches = require('./controllers/matches');
let Groups = require('./controllers/groups');
let Users = require('./controllers/users');
let Diagnostics = require('./diagnostics');

app.listen(3100, () => console.log('Server listening...'));

//wire controllers, order of middleware is super important
app.use(cors());
app.use(express.json());

Users.init(app);

Diagnostics.init(app);
app.use(passport.authenticate('bearer', { session: false }));

Tournaments.init(app);
Editions.init(app);
Schemes.init(app);
Matches.init(app);
Groups.init(app);

//error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'SequelizeValidationError') {
    const result = {}
    err.errors.forEach(e => result[e.path] = e.message);
    res.status(422).send(result);
  }
  else if (err.name === 'DomainActionError') {
    res.status(422).send(err);
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


app.use('/', express.static('build'));