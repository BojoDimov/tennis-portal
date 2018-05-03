var express = require("express");
var app = express();
app.listen(3100, () => console.log('Server listening...'));
app.use(express.json());
app.get('/', (req, res) => res.send('Hello world'));
app.post('/api/tournament/editions', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify(req.body));
});
