const backend = 'http://localhost:3100/api';

module.exports = {
  post: function (path, data, onSuccess, onError) {
    let options = {
      body: JSON.stringify(data), // must match 'Content-Type' header
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
    };

    let tokenInfo = JSON.parse(window.localStorage.getItem('token'));
    if (tokenInfo)
      options.headers['Authorization'] = 'Bearer ' + tokenInfo.token;

    return fetch(backend + path, options)
      .then(res => {
        message_handler(onError);
        return error_handler(res)
      })
      .then(res => {
        message_handler(onSuccess);
        return res.json()
      });

  },
  get: function (path) {
    let options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    let tokenInfo = JSON.parse(window.localStorage.getItem('token'));
    if (tokenInfo)
      options.headers['Authorization'] = 'Bearer ' + tokenInfo.token;

    return fetch(backend + path, options).then(res => error_handler(res))
      .then(res => res.json());
  }
}

function error_handler(res) {
  if (res.status === 422)
    return res.json().then(err => { throw err; });
  if (res.status === 500)
    return res.json().then(err => { throw err });
  if (res.status === 401) {
    window.localStorage.setItem('token', null);
    window.location.replace('login');
  }
  else return res;
}

function message_handler(message) {
  let el = document.getElementById("messages");
  let ev = new CustomEvent('message', { detail: message });
  if (message) {
    console.log('Dispatching event', ev, el);
    el.dispatchEvent(ev);
  }
}