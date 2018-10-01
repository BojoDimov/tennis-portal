const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();


app.listen(4000, () => console.log('server running @ port:4000'));
app.use(cors());
app.use(express.json());

//console.log("Static files root:", path.join(__dirname, '../public', 'index.html'));
// app.use(express.static(path.join(__dirname, '../public')));
// app.get('*.js', function (req, res, next) {
//   req.url = req.url + '.gz';
//   res.set('Content-Encoding', 'gzip');
//   next();
// });
// app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../public', 'index.html')));
app.use('/api/tournaments', require('./tournament/tournament.controller'));
app.use('/api/editions', require('./edition/edition.controller'));
app.use('/api/schemes', require('./scheme/scheme.controller'));
app.use('/api/enrollments', require('./enrollment/enrollment.controller'));

app.use('/api/teams', require('./team/team.controller'));
app.use('/api/users', require('./user/user.controller'));

