import axios from 'axios';
import env from 'react-native-config';
import StorageService, { ACCESS_TOKEN_KEY, APP_ENV_KEY } from '../services/StorageService';
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
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const appEnv = await StorageService.getData(APP_ENV_KEY);
  const devMode = appEnv === 'development';
  const apiKey = devMode ? env.MITTHELSINGBORG_IO_DEV_APIKEY : env.MITTHELSINGBORG_IO_APIKEY;

  // Merge custom headers
  const newHeaders = {
    Authorization: token || '',
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
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

const get = (endpoint = '', headers = undefined) => request(endpoint, 'get', undefined, headers);

const post = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'post', body, headers);

const remove = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'delete', body, headers);

const put = (endpoint = '', body = undefined, headers = undefined) =>
  request(endpoint, 'put', body, headers);

export { get, post, remove, put };
