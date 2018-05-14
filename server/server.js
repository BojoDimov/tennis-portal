let express = require("express");
let app = express();
let cors = require('cors');

//let { Tournaments, TournamentEditions, TournamentSchemes } = require('./sequelize.config');
let Tournaments = require('./controllers/tournament');

app.use(cors());
app.use(express.json());

app.listen(3100, () => console.log('Server listening...'));

Tournaments.init(app);

// app.post('/api/tournament/editions', (req, res) => {
//   let model = req.body;
//   model.tournamentId = 1;
//   model.status = 'draft';
//   TournamentEditions.create(model);
//   res.send(null);
// });

// app.post('/api/tournament/edition/schemes', (req, res) => {
//   let model = req.body;
//   model.tournamentEditionId = 1;
//   model.status = 'draft';
//   TournamentSchemes.create(model);
//   res.send(null);
// });

// app.get('/api/editions', (req, res) => {
//   TournamentEditions
//     .findAll({
//       include: [
//         { model: Tournaments, required: true }
//       ]
//     })
//     .then(editions => res.send(editions));
// });

// app.get('/api/schemes', (req, res) => {
//   TournamentSchemes
//     .findAll()
//     .map(scheme => scheme)
//     .then(schemes => res.send(schemes));
// });