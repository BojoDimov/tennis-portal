var express = require("express");
var app = express();
const cors = require('cors');

const { Tournaments, TournamentEditions, TournamentSchemes } = require('./sequelize.config');

app.use(cors());
app.use(express.json());

app.listen(3100, () => console.log('Server listening...'));

app.get('/', (req, res) => res.send('Hello world'));
app.post('/api/test', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify(req.body));
});

app.post('/api/tournaments', (req, res) => {
  let model = req.body;
  model.status = 'draft';
  let tournament = Tournaments.create(model)
    .then(e => res.json(e));
});

app.post('/api/tournament/editions', (req, res) => {
  let model = req.body;
  model.tournamentId = 1;
  model.status = 'draft';
  TournamentEditions.create(model);
  res.send(null);
});

app.post('/api/tournament/edition/schemes', (req, res) => {
  let model = req.body;
  model.tournamentEditionId = 1;
  model.status = 'draft';
  TournamentSchemes.create(model);
  res.send(null);
});

app.get('/api/tournaments', (req, res) => {
  Tournaments
    .findAll()
    .then(tournaments => res.send(tournaments));
});

app.get('/api/editions', (req, res) => {
  TournamentEditions
    .findAll({
      include: [
        { model: Tournaments, required: true }
      ]
    })
    .then(editions => res.send(editions));
});

app.get('/api/schemes', (req, res) => {
  TournamentSchemes
    .findAll()
    .map(scheme => scheme)
    .then(schemes => res.send(schemes));
});