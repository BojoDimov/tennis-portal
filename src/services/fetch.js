const backend = 'http://localhost:3100/api';

module.exports = {
  post: function (path, data) {
    let tokenInfo = JSON.parse(window.localStorage.getItem('token'));
    return fetch(backend + path, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (tokenInfo ? tokenInfo.token : '')
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
    }).then(res => error_handler(res))
      .then(res => res.json());

  },
  get: function (path) {
    let tokenInfo = JSON.parse(window.localStorage.getItem('token'));
    let options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (tokenInfo ? tokenInfo.token : '')
      }
    }
    return fetch(backend + path, options).then(res => error_handler(res))
      .then(res => res.json());
  }
}

function error_handler(res) {
  if (res.status === 422)
    return res.json().then(err => { throw err; });
  if (res.status === 401) {
    window.localStorage.setItem('token', null);
    window.location.replace('login');
  }
  else return res;
}