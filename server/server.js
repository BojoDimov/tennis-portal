let express = require("express");
let app = express();
let cors = require('cors');

let Tournaments = require('./controllers/tournaments');
let Editions = require('./controllers/editions');
let Schemes = require('./controllers/schemes');
let Users = require('./controllers/users');

app.use(cors());
app.use(express.json());

app.listen(3100, () => console.log('Server listening...'));

Tournaments.init(app);
Editions.init(app);
Schemes.init(app);
Users.init(app);

app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const result = {}
    err.errors.forEach(e => result[e.path] = e.message);
    res.status(422).send(result);
  }
  else res.status(500).end();
});