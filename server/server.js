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
  Tournaments.create(req.body);
  res.send(null);
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