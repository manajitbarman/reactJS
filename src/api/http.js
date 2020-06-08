import axios from 'axios';
import { apiHost, CONSTANTS } from '../config/global';
import { toFormData, uriEncode } from '../utils/features';
import { getCookie } from '../utils/cookie';

axios.defaults.baseURL = 'http://ec2-35-174-156-7.compute-1.amazonaws.com:8080';
axios.defaults.headers.common['Content-Type'] = 'application/json';


export function setAuthHeaders(token) {
    axios.defaults.headers.common.Authorization = token;
  }
  
  export function resetAuthHeaders() {
    delete axios.defaults.headers.common.Authorization;
  }
  
  export function getAuthToken() {
    let token =  axios.defaults.headers.common.Authorization;
    if (!token) {
      return getCookie(CONSTANTS.TOKEN);
    }
  }

function requestFactory({ method, url, data, formData, options }) {
    const { disableAuthorization, ...other } = options || {};
    const REQUEST = function() {
      let promise;
      const token = getAuthToken();
  
      if (REQUEST.data === void 0) {
        if (disableAuthorization) {
          resetAuthHeaders();
          promise = axios[method](REQUEST.url, REQUEST.options);
          setAuthHeaders(token);
        } else {
          promise = axios[method](REQUEST.url, REQUEST.options);
        }
      } else if (disableAuthorization) {
        resetAuthHeaders();
        promise = axios[method](REQUEST.url, REQUEST.data, REQUEST.options);
        setAuthHeaders(token);
      } else {
        promise = axios[method](REQUEST.url, REQUEST.data, REQUEST.options);
      }
      return promise;
    };
    REQUEST.url = url;
    REQUEST.data = formData ? toFormData(formData) : data;
    REQUEST.options = { paramsSerializer: uriEncode, ...other };
  
    return REQUEST;
  }


export default {
    /**
     * to simply send a request use like this get(url, {params: {test: 'test'}})()
     * will send a get request to "url?test=test"
     *
     * @param url - url
     * @param {{}} [options] - options for axios
     * @param {{}} [options.params] - query params
     * @param {boolean} [options.disableAuthorization] - disabled auth header
     * @returns {Function} - wrapper for request
     */
    get: (url, options) => requestFactory({ method: 'get', url, options }),
    /**
     * to simply send a request use like this post(url, {options: {params:{test: 'test'}}, data: 'hello world'})()
     * will send a post request to "url?test=test" with request body 'hello world'
     *
     * @param url - url
     * @param {{}} [data] - request body
     * @param {{}} [formData] - request body that must be converted to FormData
     * @param {{}} [options] - options for axios
     * @param {{}} [options.params] - query params
     * @param {boolean} [options.disableAuthorization] - disabled auth header
     * @returns {Function} - wrapper for request
     */
    post: (url, { data, formData, options } = {}) => requestFactory({ method: 'post', url, data, formData, options }),
    /**
     * to simply send a request use like this put(url, {options: {params:{test: 'test'}}, data: 'hello world'})()
     * will send a put request to "url?test=test" with request body 'hello world'
     *
     * @param url - url
     * @param {{}} [data] - request body
     * @param {{}} [formData] - request body that must be converted to FormData
     * @param {{}} [options] - options for axios
     * @param {{}} [options.params] - query params
     * @param {boolean} [options.disableAuthorization] - disabled auth header
     * @returns {Function} - wrapper for request
     */
    put: (url, { data, formData, options } = {}) => requestFactory({ method: 'put', url, data, formData, options }),
    /**
     * to simply send a request use like this post(url, {params: {test: 'test'}})()
     * will send a delete request to "url?test=test"
     *
     * @param url - url
     * @param {{}} [options] - options for axios
     * @param {{}} [options.params] - query params
     * @param {boolean} [options.disableAuthorization] - disabled auth header
     * @returns {Function} - wrapper for request
     */
    delete: (url, options) => requestFactory({ method: 'delete', url, options })
  };