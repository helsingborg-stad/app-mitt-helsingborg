import axios from 'axios';
import StorageService, { TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

/**
 * Axios request
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 */
const request = async (endpoint, method, data, headers) => {
  // Build complete api url
  const url = buildServiceUrl(endpoint);
  const token = await StorageService.getData(TOKEN_KEY);
  const bearer = token ? `Bearer ${token}` : '';

  // Merge custom headers
  const newHeaders = {
    ...{
      Authorization: bearer,
      'Content-Type': 'application/json',
    },
    ...headers,
  };

  // Do request
  const req = await axios({
    url,
    method,
    headers: newHeaders,
    data: data !== undefined ? data : undefined,
  })
    .then(res => res)
    .catch(error => {
      console.log('API request error', error);
      return error;
    });

  return req;
};

const get = (endpoint = '', headers = undefined) => request(endpoint, 'get', undefined, headers);

const post = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'post', body, headers);

const remove = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'delete', body, headers);

const put = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'put', body, headers);

export { get, post, remove, put };
