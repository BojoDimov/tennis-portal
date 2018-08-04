const express = require('express');
const app = express();
const cors = require('cors');

app.listen(8080, () => console.log('Server listening...'));
app.use(cors());

app.use('/', express.static('build'));
app.use('/diagnostics', require('./diagnostics'));
app.use('/api/files', require('./controllers/files'));
app.use('/api', express.json(), require('./controllers'));

app.get('*', (req, res) => {
  res.sendFile('build/index.html', { root: './' });
});

app.use(require('./middlewares/errors'));
