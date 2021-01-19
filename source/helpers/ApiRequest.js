import axios from 'axios';
import StorageService, { ACCESS_TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

/**
 * Axios request
 * User ID will overwrite bearer token in header.
 *
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 */
const request = async (endpoint, method, data, headers) => {
  const url = await buildServiceUrl(endpoint);
  const token = await StorageService.getData(TOKEN_KEY);

    const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  // Merge custom headers
  const newHeaders = {
    Authorization: token || '',
    'Content-Type': 'application/json',
    ...headers,
  };

  try {
    // Do request
    const req = await axios({
      url,
      method,
      headers: newHeaders,
      data: data !== undefined ? data : undefined,
    });
    return req;
  } catch (error) {
    return { message: error.message, ...error.response };
  }
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
