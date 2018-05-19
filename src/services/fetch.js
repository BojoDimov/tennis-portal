const backend = 'http://localhost:3100/api';

module.exports = {
  post: function (path, data) {
    return fetch(backend + path, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
    })
      .then(res => {
        if (res.status === 422)
          return res.json().then(err => { throw err; })
      })
      .then(response => response.json());

  },
  get: function (path) {
    return fetch(backend + path, {
      method: 'GET',
      mode: 'cors'
    }).then(response => response.json())
  }
}

function urlEncode(queryParams) {
  return 'TODO_implement';
}