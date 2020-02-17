import axios from 'axios';
import StorageService, { TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

export const get = (endpoint = '', headers = undefined) =>
  request(endpoint, 'get', undefined, headers);

export const post = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'post', body, headers);

export const remove = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'delete', body, headers);

export const put = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'put', body, headers);

/**
 * Axios request
 * @param {string} endpoint
 * @param {string} method
 * @param {obj} data
 * @param {obj} headers
 */
const request = (endpoint, method, data, headers) =>
  new Promise(async (resolve, reject) => {
    // Build complete api url
    const url = buildServiceUrl(endpoint);
    const token = await StorageService.getData(TOKEN_KEY);
    const bearer = token ? `Bearer ${token}` : '';

    // Merge custom headers
    headers = {
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
      headers,
      data: data !== undefined ? data : undefined,
    })
      .then(res => {
        if (res.status >= 200 && res.status < 400) {
          return resolve(res);
        }
        return reject({
          status: res.status,
        });
      })
      .catch(error => {
        console.log('API request error', error);
        return reject(error);
      });

    return req;
  });
