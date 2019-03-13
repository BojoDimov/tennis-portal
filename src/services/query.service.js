import { dispatchEvent } from './events.service';
import Configuration from '../configuration';

class QueryService {
  constructor() {
    this.backend = (window.configuration || Configuration).backend;

    console.log(this.backend);
  }

  uploadFile(content) {
    let data = new FormData();
    data.append('file', content);

    let options = {
      method: 'POST',
      mode: 'cors',
      body: data
    }

    return fetch(this.backend + '/files', options)
      .then(res => this.errorHandling(res))
      .then(res => res.json());
  }

  getFileUrl(fileId) {
    return `${this.backend}/files/${fileId}`;
  }

  get(resource) {
    let options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return this
      .request(resource, options);
    //.then(this.notFoundHandling);
  }

  post(resource, body) {
    let options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    return this.request(resource, options);
  }

  delete(resource) {
    let options = {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return this.request(resource, options);
  }

  request(resource, options) {
    let tokenInfo = JSON.parse(window.localStorage.getItem('token'));
    if (tokenInfo)
      options.headers['Authorization'] = 'Bearer ' + tokenInfo.token;

    return fetch(this.backend + resource, options)
      .then(res => this.errorHandling(res))
      .then(res => res.json());
  }

  errorHandling(res) {
    if (res.status === 404) {
      dispatchEvent('not-found');
      throw null;
    }
    if (res.status === 422)
      return res
        .json()
        .then(err => { throw err; });
    if (res.status === 500)
      throw null;
    if (res.status === 401) {
      window.localStorage.setItem('token', null);
      window.location.replace('/');
    }
    else return res || null;
  }

  notFoundHandling(item) {
    if (item == null) {
      dispatchEvent('not-found');
      throw null;
    }
    else return item;
  }
}

export default new QueryService();