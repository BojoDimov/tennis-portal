const express = require('express');
const app = express();
const cors = require('cors');
const auth = require('./middlewares/auth');

app.listen(3100, () => console.log('Server listening...'));
app.use(cors());
app.use(express.json());
app.use('/', express.static('build'));

app.use('/diagnostics', require('./diagnostics'));

app.use('/api/login', require('./controllers/login'))
app.use('/api/users', require('./controllers/users'));
app.use('/api/tournaments', auth, require('./controllers/tournaments'));
app.use('/api/editions', auth, require('./controllers/editions'));
app.use('/api/schemes', auth, require('./controllers/schemes'));
app.use('/api/groups', auth, require('./controllers/groups'));
app.use('/api/matches', require('./controllers/matches'));

app.get('*', (req, res) => {
  res.sendFile('build/index.html', { root: './' });
});

app.use(require('./middlewares/errors'));
