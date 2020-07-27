import axios from 'axios';
import { resetAuthHeaders } from '../api/http'

export default class requests {
  _requests = {};
  _chains = {};

  constructor() {
    this._requests = {};
  }

  registerRequest(request, key = Math.random()) {
    const CancelToken = axios.CancelToken;
    const executor = c => {
      this._requests[key] = c;
    };
    request.options = { ...request.options || {}, cancelToken: new CancelToken( executor )};
    this._chains[key] = request()
      .then((...args) => {
        delete this._requests[key];
        return Promise.resolve(...args);
      })
      .catch(err => {
        delete this._requests[key];
        if (err.response && err.response.status === 401) {
          // session expired
          resetAuthHeaders();
          // window.location.reload();
        }
        return Promise.reject(err.response.data);
      });
    return this._chains[key];
  }

  has(key) {
    return this._requests[key] !== void 0;
  }

  abort(key) {
    if (this._requests[key]) {
      this._requests[key]();
      this._requests[key] = void 0;
      this._chains[key] = void 0;
    }
  }

  abortAll() {
    Object.keys(this._requests).forEach(key => {
      this._requests[key]();
      this._requests[key] = void 0;
      this._chains[key] = void 0;
    });
  }

}
