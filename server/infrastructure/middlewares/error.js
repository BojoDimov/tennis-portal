const { Logs } = require('../../db');

module.exports = (err, req, res) => {
  if (err.name === 'SequelizeValidationError') {
    const result = {}
    err.errors.forEach(e => result[e.path] = e.message);

    return Logs
      .create({
        ip: req.ip,
        path: req.path,
        method: req.method,
        body: null,
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query),
        error: JSON.stringify(result)
      })
      .then(e => res.status(422).send(result));
  }
  else if (err.name === 'SequelizeUniqueConstraintError') {
    const result = {}
    const keys = Object.keys(err.fields);
    keys.forEach(key => result[key + '_uq'] = err.fields[key]);
    return Logs
      .create({
        ip: req.ip,
        path: req.path,
        method: req.method,
        body: null,
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query),
        error: JSON.stringify(result)
      })
      .then(e => res.status(422).send(result));
  }
  else if (err.name === 'DomainActionError') {
    res.status(422).send(err.error);
  }
  else if (err.name === 'NotFound')
    res.status(404).send();
  else Logs
    .create({
      ip: req.ip,
      path: req.path,
      method: req.method,
      body: null,
      params: JSON.stringify(req.params),
      query: JSON.stringify(req.query),
      error: JSON.stringify(err)
    })
    .then(() => res.status(500).send({ message: 'Internal server error' }));
}