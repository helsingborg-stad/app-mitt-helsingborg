import axios from 'axios';
import StorageService, { TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

/**
 * Axios request
 * User ID will overwrite bearer token in header.
 *
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 * @param userId  Will overwrite bearer token in header if set.
 */
const request = async (endpoint, method, data, headers, userId) => {
  // Build complete api url
  const url = buildServiceUrl(endpoint);

  let bearer;
  if (userId) {
    bearer = userId;
  } else {
    const token = await StorageService.getData(TOKEN_KEY);
    bearer = token ? `Bearer ${token}` : '';
  }

  // Merge custom headers
  const newHeaders = {
    Authorization: bearer,
    'Content-Type': 'application/json',
    ...headers,
  };

  // Do request
  return axios({
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
};

const get = (endpoint = '', headers = undefined, userId = undefined) =>
  request(endpoint, 'get', undefined, headers, userId);

const post = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'post', body, headers);

const remove = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'delete', body, headers);

const put = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'put', body, headers);

export { get, post, remove, put };
